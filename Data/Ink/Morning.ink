=== morning ===
// The morning is always class time
-> class -> map

=== class ===
// Classroom Dispatcher
~ ChangeScene(RogueClass)
{
	- day == 1: -> RogueClass1
	- else: This is the end of the demo! -> DONE
}
->->