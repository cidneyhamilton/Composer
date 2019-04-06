// ************************************************************************
// System: Map and Transportation
// ************************************************************************

=== map ===
~ AdvanceTime()
~ PlayMusic(None)
// Can now use the journal in the game!
~ EnableJournalButton()
~ ChangeScene(_None)
-> map.destination

= destination
- Choose your destination:
+ { currentRoom != Courtyard } Courtyard
    ~ ChangeScene(Courtyard)
+ { currentRoom != ExerciseRoom } Exercise Room
    ~ ChangeScene(ExerciseRoom)
+ { currentRoom != FestivalGrounds && time == Afternoon } Festival Grounds
    ~ ChangeScene(FestivalGrounds)
+ { currentRoom != Infirmary } Infirmary
    ~ ChangeScene(Infirmary)
+ { currentRoom != Kitchen && kitchenOpen && time == Evening } Kitchen
    ~ ChangeScene(Kitchen)
+ { currentRoom != Library } Library
    ~ ChangeScene(Library)
+ { currentRoom != PracticeField  && time == Afternoon } Practice Field
    ~ ChangeScene(PracticeField)
+ { currentRoom != RecRoom } Rec Room
    ~ ChangeScene(RecRoom)
+ { currentRoom != Store && storeOpen && time == Evening } School Store
    ~ ChangeScene(Store)
+ { currentRoom != TowerGarden && time == Evening } Tower Garden
    ~ ChangeScene(TowerGarden)
+ { currentRoom != WineCellar && time == Evening } Wine Cellar
    ~ ChangeScene(WineCellar)
+ { currentRoom != Workshop && time == Afternoon } Workshop
    ~ ChangeScene(Workshop)
- -> next

=== next ===
{ 
- time == Afternoon: -> afternoon
- time == Evening: -> evening
}

=== afternoon ===
{ 
- currentRoom == Library: -> LibraryDaytime1
- currentRoom == PracticeField: -> PracticeFieldDaytime1
- else: You spend all afternoon here, but nothing happens.
}
- -> dinner -> map

=== evening ===
You spend all evening here, but nothing happens.
- -> sleep -> class

=== dinner ===
~ PlayMusic(DiningHall)
~ ChangeScene(DiningHall)
- This is the end of the demo! 
- ->->

=== sleep ===
~ PlayMusic(None)
~ ChangeScene(Bedroom)
~ AdvanceTime()
>>> SOUND: sleep_stinger
Zzzzz.
- ->->

=== class ===
~ ChangeScene(RogueClass)
{
- day == 1: -> RogueClass1
- else: This is the end of the demo! -> DONE
}

