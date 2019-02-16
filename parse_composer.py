import json
import re
import string
import glob
import os

###############################################################################
#### Configuration:
### Path to read JSON scripts from.
input_path = "../Hero-U/Composer/Data/Scripts"
## Path to output Ink scripts to 
output_path = "/Output"
###############################################################################

tag_list = []
var_list = []
const_list = []
inv_list = []

scripts = {
	'0008aa16-e7db-43c2-9a2d-0ceb6e9dada4': 'RecRoomJoel'
}
entryPoints = {
	'875c51cf-06a7-4f2e-baa9-64a5b0570f71': 'ChallengetoGame'
}

class Node():

	def __init__(self, children, depth):
		self.depth = depth
		self.children = children

	def parse(self):
		return self.indent() + "# TODO"

	def parse_children(self):
		result = ""
		self.depth += 1
		for child in self.children:
			s = parse_node(child, self.depth)
			if s != None:
				result = result + "{0}".format(s)
		self.depth -= 1
		return result

	def indent(self):
		''' Generate whitespace based on the depth in the tree'''
		result = "\n"
		result += "    " * self.depth
		return result

class Expression(Node):

	def __init__(self, node):

		self.node = node

		if "left" in node:
			self.left = node["left"]

		if "right" in node:
			self.right = node["right"]

		if "tags" in node:
			self.tags = node["tags"]

		if "has" in node:
			self.has = node["has"]

		if "propId" in node:
			self.propId = node["propId"]

	def parse(self):
		result = ""
		if "type" in self.node:
			type = self.node["type"]
			if type == "expressions.variableComparison":
				result += self.parse_var_comparison()
			elif type == "expressions.or":
				result += self.parse_or()
			elif type == "expressions.and":
				result += self.parse_and()
			elif type == "expressions.inInventory":
				result += self.parse_in_inventory()
			elif type == "expressions.inTags":
				result += self.parse_in_tags()
			elif type == "expressions.currentScene":
				# TODO: Implement Has Active Quest
				result += "true"
			elif type == "expressions.actorPresent":
				# TODO: Implement Actor Present
				result += "true"
			elif type == "expressions.isEquipped":
				# TODO: Implement Is Equipped
				result += "true"
			elif type == "expressions.hasActiveQuest":
				# TODO: Implement Has Active Quest
				result += "true"
			elif type == "expressions.reputationComparison":
				# TODO: Implement Reputation Comparison
				result += "true"
			elif type == "expressions.enteredScene":
				# TODO: Implement Entered Scene
				result += "true"
			elif type == "expressions.skillCheck":
				result += "true"
			elif type == "expressions.previousScene":
				result += "true"
			elif type == "expressions.isPoisoned":
				result += "false"
			elif type == "expressions.propStatus":
				result += "true"
			elif type == "expressions.debugOnly":
				result += "true"
		return result

	def parse_or(self):
		return self.parse_logic("||")

	def parse_and(self):
		return self.parse_logic("&&")

	def parse_in_inventory(self):
		propName = get_inv_name(self.propId)

		# Add to master var list, if it's not already there
		if propName not in inv_list:
			inv_list.append(propName)
		
		if self.has:
			return "Inventory has {0}".format(propName)
		else:
			return "Inventory has ({0})".format(propName)

	def parse_in_tags(self):
		tags = self.tags
		append_tag_list(tags)

		if self.has:
			# check to see if this is in the tags
			return "Tags has {0}".format(tags)
		else:
			return "Tags has ({0})".format(tags)

	def parse_logic(self, operator):
		left = Expression(self.left)
		right = Expression(self.right)
		return "{0} {1} {2}".format(left.parse(), operator, right.parse())

	def parse_operator(self):
		operator = self.node["operator"]
		if operator == "lt":
			return "<"
		elif operator == "lte":
			return "<="
		elif operator == "gt":
			return ">"
		elif operator == "gte":
			return ">="
		elif operator == "eq":
			return "=="
		elif operator == "ne":
			return "!="

	def parse_var_comparison(self):
		
		operator = self.parse_operator()

		var = self.node["variableName"]

		# Strip invalid characters from variable
		var = re.sub(r'\W+', '', var)
		
		append_var_list(var)

		const = re.sub(r'\W+', '', self.node["compareTo"])
		append_const_list(const)

		return "{0} {1} {2}".format(var, operator, const)

class SetVariable(Node):

	def __init__(self, depth, node):
		self.name = node["name"]
		self.depth = depth

	def parse(self):
		result = self.indent()
		# TODO: Implement for values and ranges of values
		result += "~ {0} = {1}".format(self.name, 0)
		return result

class BranchSection(Node):

	def __init__(self, expression, children, depth):

		if expression == None:
			self.expression = None
		else:
			self.expression = Expression(expression)
		
		self.children = children
		self.depth = depth

	def parse(self):

		result = ""

		parsed_children = self.parse_children()
		if self.expression == None:
			# This is just a block of nodes; no expression to evaluate
			if parsed_children != "":
				result += "else: {0}".format(parsed_children)
			else:
				return result
		else:
			result += "{0}:".format(self.expression.parse())
			result += parsed_children
		return result

class Branch(Node):

	def __init__(self, sections, depth):
		self.sections = sections
		self.depth = depth

	def parse(self):

		result = ""
		if len(self.sections) > 0:
			for section in self.sections:
				s = parse_branch_section(section, self.depth + 1)
				if s != "":
					result += self.indent() + "    - {0}".format(s)
		if result != "":
			return self.indent() + "{" + result + self.indent() + "}"
		return ""
			
class Option(Node):
	'''A dialogue option for the player'''

	def __init__(self, depth, node, parent):
		self.text = node["text"]
		self.children = node["nodes"]
		self.depth = depth
		self.parent = parent

		if "expression" in node:
			self.expression = node["expression"]
		else:
			self.expression = None

		if "ignoreChildAvailability" in node:
			self.alwaysShow = node["ignoreChildAvailability"]

	def parse(self):
		result = self.indent()

		if self.alwaysShow:
			result += "+ "
		else:
			result += "* "
		if self.expression != None:
			result += "{{ {0} }} ".format(Expression(self.expression).parse())
		if self.text != None:
			result += "{0}".format(self.text)

		result += self.parse_children()

		result += self.indent() + "-> {0}".format(self.parent)

		return result

class Menu(Node):
	'''A menu of options for the player'''

	def __init__(self, depth, node):
		'''
		:param options: a list of options in the menu
		'''
		self.options = node["options"]
		self.depth = depth
		self.weaveName = re.sub(r'\W+', '', node["id"])

		if "AutoAddDone" in node:
			self.isAutoAddDone = node["AutoAddDone"]
		else:
			self.isAutoAddDone = False

		if "Unique" in node:
			self.unique = node["Unique"]
		else:
			self.unique = False

	def optionsList(self):
		options = []
		if self.options != None:
			for x in self.options:
				option = Option(self.depth, x, self.weaveName)
				options.append(option.parse())

		if self.isAutoAddDone:
			options.append(self.indent() + "+ Done\n  -> DONE")
		return options

	def parse(self):
		result = self.indent()

		result += "- ({0})".format(self.weaveName)
		list = self.optionsList()
		for x in list:
			result += x
		return result

class ChangeTags(Node):

	def __init__(self, tagsToAdd, tagsToRemove, depth):
		self.tagsToAdd = tagsToAdd;
		self.tagsToRemove = tagsToRemove
		self.depth = depth

	def parse(self):
		return self.parse_add() + self.parse_remove()

	def parse_add(self):
		return self.parse_helper(self.tagsToAdd, "~ Tags +=")

	def parse_remove(self):
		return self.parse_helper(self.tagsToRemove, "~ Tags -=")

	def parse_helper(self, list, prefix):
		result = ""
		if list != None and list != "":
			list = list.replace(",", ", ")
			result += self.indent()
			tags = list.split(",")
			if len(tags) > 1:
				result += "{0} ({1})".format(prefix, list)
			else:
				result += "{0} {1}".format(prefix, list)

			for tag in tags:
				append_tag_list(tag)
		return result

class Speak(Node):

	def __init__(self, depth, node):

		if "text" in node:
			self.text = node["text"]
		else:
			self.text = ""

		self.speaker = ""
		if "actorId" in node:
			self.speaker = get_actor_name(node["actorId"])

		self.listener = ""
		if "actorId2" in node:
			actor2 = node["actorId2"]
			if actor2 != None:
				self.listener = get_actor_name(node["actorId2"])
			
		self.depth = depth

	def parse(self):
		result = self.indent()
		try:
			result += "{0}: {1}".format(self.speaker, self.text)
			return result
		except UnicodeEncodeError:
			return ""

class Invoke(Node):

	def __init__(self, depth, node):
		self.scriptId = str(node["scriptId"])
		self.entryPointId = str(node["entryPointId"])
		self.depth = depth

	def parse(self):

		# TODO: Real knot names from script id
		knot = get_script_name(self.scriptId)

		stitch = get_stitch_name(self.entryPointId)
		
		# Add introductory white space
		result = self.indent()
		if (stitch == ""):
			result += "-> {0}".format(knot)
		else:
			result += "-> {0}.{1}".format(knot, stitch)

		return result

class Script(Node):

	def __init__(self, node):
		
		try:
			self.id = str(node["id"])
			self.name = str(node["name"])
			self.entryPoints = node["entryPoints"]
		except UnicodeEncodeError:
			self.id = ""
			self.name = ""
			self.entryPoints = None
			print("Can't encode script") 

	def parse(self):
		result = "\n"
		if self.name != None:
			knotname = re.sub(r'\W+', '', self.name)
			result += "=== {0} ===".format(knotname)

		if self.entryPoints != None:
			for entry in self.entryPoints:
				result += EntryPoint(entry).parse()

		# Add script to list of scripts
		scripts[self.id] = self.name.replace(" ", "").replace("'", "")

		return result

class EntryPoint(Node):

	def __init__(self, node):
		self.name = str(node["name"])
		self.nodes = node["nodes"]
		self.id = str(node["id"])

	def parse(self):
		result = "\n\n"
		result += "= {0}\n".format(self.name.replace(" ", ""))

		for node in self.nodes:
			if node != None:
				s = parse_node(node, 1)
				if s != None:
					result += s

		# Add entry point to list of entry points
		entryPoints[self.id] = self.name

		return result

def append_tag_list(tags):
	tags = tags.split(", ")
	for tag in tags:

		tag = re.sub(r'\W+', '', tag)
		if tag not in tag_list and tag != "":
			# print("Appending to tag list: {0}".format(tag))
			tag_list.append(tag)

def append_var_list(var):
	var = var.replace(".", "")
	if var not in var_list:
			var_list.append(var)

def append_const_list(const):
	if const not in const_list:
		# Check to make sure the constant isn't an int or float
		if not RepresentsInt(const) and not RepresentsFloat(const):
			const_list.append(const)

def RepresentsInt(str):
	try:
		int(str)
		return True
	except ValueError:
		return False

def RepresentsFloat(str):
	try:
		float(str)
		return True
	except ValueError:
		return False

def parse_node(node, depth):
	type = node["type"]
	if type == "nodes.speak":
		return parse_speak(node, depth)
	elif type == "nodes.showMenu":
		return parse_show_menu(node, depth)
	elif type == "nodes.branch":
		return parse_branch(node, depth)
	elif type == "nodes.changeTags":
		return parse_change_tags(node, depth)
	elif type == "nodes.invokeScript":
		return Invoke(depth, node).parse()
	elif type == "script":
		return Script(node).parse()
	elif type == "nodes.setVariable":
		return SetVariable(depth, node).parse()
	else:
		return "\n# TODO"

def parse_speak(node, depth):
	speak = Speak(depth, node)
	return speak.parse()

def parse_show_menu(node, depth):
	menu = Menu(depth, node)
	
	return menu.parse()

def parse_branch(node, depth):
	'''Parses a branch node, consisting of a list of branch sections'''
	branch = Branch(node["sections"], depth)
	return branch.parse()

def parse_branch_section(node, depth):

	expression = ""
	if "expression" in node:
		expression = node["expression"]
	else:
		print("Can't find expression in this branch section!")
	branchSection = BranchSection(expression, node["nodes"], depth)
	return branchSection.parse()

def parse_change_tags(node, depth):
	if "tagsToAdd" in node:
		return ChangeTags(node["tagsToAdd"], node["tagsToRemove"], depth).parse()
	elif "tagsToRemove" in node:
		return ChangeTags(None, node["tagsToRemove"], depth).parse()
	else:
		return ""

def parse_nodes(root):
	nodes = root["nodes"]
	result = ""

	for node in nodes:
		if node != None:
			s = parse_node(node, 0)
			if s != None:
				result += s

	return result

def init_tags():
	''' Initialize a list of tags, used for game state. All tags here are GLOBAL.'''
	result = "\nLIST Tags = (SenseMagic), (open)"
	# i = 0
	# while i < len(tag_list):
	#	 result += "({0})".format(tag_list[i])
	#	 i += 1
	#	 if (i < len(tag_list)):
	#		 result += ", "
	return result

def init_vars():
	''' Initialize variables used in the game'''
	result = ""
	for var in var_list:
		result += "\nVAR {0} = false".format(var)
	return result

def init_consts():
	''' Initialize constant values (such as variable names) used in the game'''
	result = ""
	i = 1
	for const in const_list:
		result += "\nCONST {0} = {1}".format(const, i)
		i += 1		
	return result

def init_inventory():
	''' Initialize the inventory list'''

	result = ""
	i = 0
	while i < len(inv_list):
		result += "({0})".format(inv_list[i])
		i += 1
		if (i < len(inv_list)):
			result += ", "

	return "\nLIST Inventory = {0}".format(result)

def get_inv_name(propId):
	''' Given a propId from Composer, get the name of the prop for Ink scripts'''

	# TODO: Load this data from Composer. For now, use seed data.
	if propId == "13351bce-2263-456d-8387-f85cb9af24c4":
		return "BeadedNecklace"
	elif propId == "6b99d059-b486-4547-abbc-8b3169478a39":
		return "Rose"
	else:
		return "SomethingUnusual"

def get_actor_name(actorId):
	# TODO
	if actorId == "30ee2636-15e3-452e-a2db-09cbb9012970":
		return "Shawn O'Conner"
	elif actorId == "4b05c425-ca25-4abb-9a36-7d793370842f":
		return "Joel Kyro"
	else:
		return "Someone Else"

def get_script_name(scriptId):
	if scriptId in scripts:
		# print("Found script named {0}".format(scriptId))
		return scripts[scriptId]
	else:
		# Default case; can't find the script to invoke
		return "invoke"

def get_stitch_name(entryPointId):
	if entryPointId == "":
		return ""
	# print("Getting stitch named {0}".format(entryPointId))
	if entryPointId in entryPoints:
		return entryPoints[entryPointId]
	else:
		return ""

def init_lists():

	tag_list = []
	var_list = []
	const_list = []
	inv_list = []

def parse_json():


	# path = os.getcwd() + input_path
	path = input_path 
	print path
	for filename in glob.glob(os.path.join(path, '*.json')):
		result = ""
		init_lists()
		with open (filename, 'r') as file:
			load = json.load(file)
			script = Script(load)
			result = script.parse()

			outpath = os.getcwd() + output_path

			scriptName = "{0}/{1}.ink".format(outpath, script.id)
			
			with open(scriptName, 'w') as f:
				print >>f, init_tags()
				print >>f, init_vars()
				print >>f, init_consts()
				print >>f, init_inventory()
				print >>f, result
				print>> f,"\n\n=== invoke ===\n+ Something\n-> DONE"

parse_json()