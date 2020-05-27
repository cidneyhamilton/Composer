// ************************************************************************
// System: Actors
// ************************************************************************

// Potential emotions for talkers
LIST Moods = neutral, happy, sad, angry, surprised

VAR speaker = Nobody
VAR speakerMood = neutral
VAR showSpeaker = false

// Keep track of the last character the player has meet, for Dining Hall events
VAR MetLast = Nobody
VAR MetPrev = Nobody

=== function Meet(Actor) ===
    ~ Acquaintances += Actor
    {	
	- MetPrev != Actor && MetLast != Actor:
   	~ MetPrev = MetLast
 	~ MetLast = Actor
    }

=== function ShowActor(name, mood) ===
	~ showSpeaker = true
    ~ speakerMood = mood
    ~ speaker = name
    >>> SHOWACTOR: {name}

=== function HideActor(name) ===
    ~ showSpeaker = false
    ~ speaker = Nobody
    >>> HIDEACTOR: {name}

// ************************************************************************
// System: Currency
// ************************************************************************

VAR Lyra = 0
VAR Deeds = 0
VAR Demerits = 0
VAR Health = 0

=== function AddCurrency(ref currency, amount) ===
	~ currency = currency + amount

=== function RemoveCurrency(ref currency, amount) ===
	~ currency = currency - amount

=== function CheckCurrency(ref currency, amount) ===
	~ return currency >= amount
	
// ************************************************************************
// System: Journal
// ************************************************************************

VAR JournalOpen = 0
VAR JournalDetailOpen = 0
VAR JournalCharacter = Nobody

// Open the journal from Ink
=== function openjournal() ===
	>>> SHOWJOURNAL

// Show the list of NPCs as a vignette
=== function showjournal() ===
	~ JournalOpen = 1

// Hide journal vignettes
=== function hidejournal() ===
	~ JournalOpen = 0

// Show an NPC as a journal vignette
=== function showjournaldetail(name) ===
	~ JournalCharacter = name
	~ JournalDetailOpen = 1

=== function hidejournaldetail(name) ===
	~ JournalDetailOpen = 0

// ************************************************************************
// System: Minigames
// ************************************************************************

LIST Minigames = laboomba, wizbang

// ************************************************************************
// System: Props
// ************************************************************************

=== function ShowProp(name) ===
		>>> SHOW: {name}


=== function HideProp(name) ===
		>>> HIDE: {name}

// ************************************************************************
// System: Reputation
// ************************************************************************

=== function AddReputation(ref reputation, amount) ===
    ~ reputation = reputation + amount

=== function RemoveReputation(ref reputation, amount) ===
    ~ reputation = reputation - amount

=== function CheckReputation(ref reputation, amount) ===
	~ return reputation >= amount

=== function CheckReputationEquals(ref reputation, amount) ===
	~ return reputation == amount

=== function CheckReputationLTE(ref reputation, amount) ==
	~ return reputation <= amount

=== function CheckReputationNot(ref reputation, amount) ==
	~ return reputation != amount

// ************************************************************************
// System: Rooms
// ************************************************************************

// Changes the scene with a delay parameter.
=== function ChangeScene(newScene, delay) ===
    ~ currentRoom = newScene
    >>> CHANGESCENE: { delay } 

=== function CheckCurrentScene(testScene) ===
	~ return currentRoom == testScene
	
// ************************************************************************
// System: Skills
// ************************************************************************

=== function SkillCheck(ref skill, target) ===
	~ return skill >= target
	
=== function ImproveSkill(ref skill, amount) ===
	~ skill = skill + amount

// ************************************************************************
// System: Sound and Music
// ************************************************************************

=== function PlayMusic(musicClip) ===
~ BackgroundMusicTrack = musicClip

=== function PlaySound(soundClip) ===
>>> SOUND: {soundClip}

// ************************************************************************
// System: Time
// ************************************************************************

LIST timeslots = Morning, Afternoon, Dinnertime, Evening, Bedtime

VAR day = 1
VAR time = Morning

=== function AdvanceTime() ===
{ 
	- time == Morning:
	  ~ time = Afternoon
	- time == Afternoon:
	  ~ time = Evening
	- time == Evening:
		~ time = Bedtime
	- time == Bedtime:
	  ~ time = Morning
	  ~ day++
}
