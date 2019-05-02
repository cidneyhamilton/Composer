// ************************************************************************
// System: Map and Transportation
// ************************************************************************

=== map ===
~ AdvanceTime()
~ PlayMusic(Silence)
// Can now use the journal in the game!
~ EnableJournalButton()
~ ChangeScene(_None)
-> destination

=== dinnertime ===
-> dinner -> map

=== function CourtyardAvailable()=== 
{
    - currentRoom == Courtyard:
        ~ return false
    - time == Evening:
        ~ return false
    - day < 7 || day > 11:
        ~ return false
    - else:
        ~ return true
}

=== function ExerciseRoomAvailable()=== 
{
    - currentRoom == ExerciseRoom:
        ~ return false
    - day == 6 || day >= 12:
        ~ return false
    - else:
        ~ return true
}

=== function FestivalGroundsAvailable()===
{
    - currentRoom == FestivalGrounds:
        ~ return false
    - time == Evening:
        ~ return false
    - day < 3 || day == 6:
        ~ return false
    - else:
        ~ return true
}

=== function InfirmaryAvailable()=== 
{
    - currentRoom == Infirmary:
        ~ return false
    - time == Afternoon:
        ~ return false
    - day < 2 || day > 12:
        ~ return false
    - else:
        ~ return true
}

=== function KitchenAvailable()==
{
    - currentRoom == Kitchen:
        ~ return false
    - time == Afternoon:
        ~ return false
    - day < 4:
        ~ return false
    - else:
        ~ return true
}

=== function LibraryAvailable()==
{
    - currentRoom == Library:
        ~ return false
    - day == 6 || day >= 12:
        ~ return false
    - else:
        ~ return true
}



=== function PracticeFieldAvailable()=== 
{
    - currentRoom == PracticeField:
        ~ return false
    - time == Evening:
        ~ return false
    - day == 6 || day >= 12:
        ~ return false
    - else:
        ~ return true
}

=== function RecRoomAvailable()=== 
{
    - currentRoom == RecRoom:
        ~ return false
    - time == Afternoon && day == 1:
        ~ return false
    - day == 6 || day >= 12:
        ~ return false
    - else:
        ~ return true
}

=== function StoreAvailable()==
{
    - currentRoom == Store:
        ~ return false
    - time == Afternoon && day == 3:
        ~ return false
    - day < 3 || day >= 12:
        ~ return false
    - else:
        ~ return true
}

=== function TowerAvailable()=== 
{
    - currentRoom == TowerGarden:
        ~ return false
    - time == Afternoon:
        ~ return false
    - day < 7 || day >= 12:
        ~ return false
    - else:
        ~ return true
}

=== function WineCellarAvailable()=== 
{
    - currentRoom == WineCellar:
        ~ return false
    - time == Afternoon:
        ~ return false
    - day < 7 || day >= 12:
        ~ return false
    - else:
        ~ return true
}

=== function WorkshopAvailable()=== 
{
    - currentRoom == Workshop:
        ~ return false
    - time == Evening:
        ~ return false
    - day == 6 || day >= 12:
        ~ return false
    - else:
        ~ return true
}

=== destination ===
- Choose your destination:
+ { LibraryAvailable() } Library
    ~ ChangeScene(Library)
+ { ExerciseRoomAvailable() } Exercise Room
    ~ ChangeScene(ExerciseRoom)
+ { PracticeFieldAvailable() } Practice Field
    ~ ChangeScene(PracticeField)
+ { WorkshopAvailable() } Workshop
    ~ ChangeScene(Workshop)
+ { CourtyardAvailable() } Courtyard
    ~ ChangeScene(Courtyard)
+ { FestivalGroundsAvailable() } Festival Grounds
    ~ ChangeScene(FestivalGrounds)
+ { InfirmaryAvailable() } Infirmary
    ~ ChangeScene(Infirmary)
+ { KitchenAvailable() } Kitchen
    ~ ChangeScene(Kitchen)
+ { RecRoomAvailable() } Rec Room
    ~ ChangeScene(RecRoom)
+ { StoreAvailable() } School Store
    ~ ChangeScene(Store)
+ { TowerAvailable() } Tower Garden
    ~ ChangeScene(TowerGarden)
+ { WineCellarAvailable() } Wine Cellar
    ~ ChangeScene(WineCellar)

- -> next

=== next ===
{ 
- time == Afternoon: -> afternoon
- time == Evening: -> evening
}

=== afternoon ===
{ 
- currentRoom == ExerciseRoom: -> MaxExerciseDaytime1
- currentRoom == Library: -> LibraryDaytime1
- currentRoom == PracticeField: -> PracticeFieldDaytime1
- currentRoom == Workshop: -> WorkshopDaytime1
- else: You spend all afternoon here, but nothing happens.
}
- -> dinner -> map

=== evening ===
You spend all evening here, but nothing happens.
- -> sleep -> class

=== dinner ===
~ PlayMusic(DiningHall)
~ ChangeScene(DiningHall)
# TODO: Temporary gating around the demo.
{
    - day == 1: -> DiningHallSetup
    - else: This is the end of the demo! ->->
}

=== sleep ===
~ PlayMusic(Silence)
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

