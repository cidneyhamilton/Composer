// ************************************************************************
// System: Actors
// ************************************************************************

// Potential emotions for talkers
LIST Moods = neutral, happy, sad, angry, surprised

// Set some variables about the interlocutor
VAR speaker = Nobody
VAR speakerMood = neutral
VAR showSpeaker = false

=== function ShowActor(name, mood) ===
    ~ showSpeaker = true
    ~ speakerMood = mood
    ~ speaker = name

=== function HideActor(name) ===
    ~ showSpeaker = false
    ~ speaker = Nobody

// ************************************************************************
// System: Journal
// ************************************************************************

VAR JournalOpen = 0
VAR JournalDetailOpen = 0
VAR JournalCharacter = Nobody
VAR JournalButtonVisible = 0

=== function EnableJournalButton() ===
		~ JournalButtonVisible = 1

=== function ShowJournal() ===
		~ JournalOpen = 1

=== function HideJournal() ===
		~ JournalOpen = 0

=== function ShowJournalCharacter(name) ==
		~ JournalCharacter = name
		~ JournalDetailOpen = 1

=== function HideJournalCharacter() ==
		~ JournalDetailOpen = 0

// ************************************************************************
// System: Reputation
// ************************************************************************

=== function AddReputation(reputation, amount) ===
    ~ reputation = reputation + amount

=== function RemoveReputation(reputation, amount) ===
    ~ reputation = reputation - amount

// ************************************************************************
// System: Rooms
// ************************************************************************


// Changes the scene. Corresponds to the node in Composer.
=== function ChangeScene(newScene) ===
    ~ currentRoom = newScene
    >>> CHANGESCENE

// ************************************************************************
// System: Time
// ************************************************************************

LIST timeslots = Morning, Afternoon, Evening

VAR day = 1
VAR time = Morning 

=== function AdvanceTime() ===
{ 
	- time == Morning:
	    ~ time = Afternoon
	- time == Afternoon:
	    ~ time = Evening
	- time == Evening:
	    ~ time = Morning
	    ~ day++
}