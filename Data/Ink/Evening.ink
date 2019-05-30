=== evening ===
{ 
    - currentRoom == RecRoom: 
        -> recroom -> bedtime
    - currentRoom == ExerciseRoom: 
        -> exerciseroom -> bedtime
    - currentRoom == Library: 
        -> library -> bedtime
    - else: 
        You spend all evening here, but nothing happens. -> bedtime
}

= recroom
~ Meet(Sitari)
{
    - day == 1: -> RecRoom_SitariRecRoomEvening1
    - else: This is the end of the demo! -> DONE
}
->->

= exerciseroom
~ Meet(Max)
{
    - day == 1: -> ExerciseRoom_MaxEvening1
    - else: This is the end of the demo! -> DONE
}
->->

= library
~ Meet(Kitty)
This is the end of the demo! -> DONE
->->

=== bedtime ===
~ AdvanceTime()
~ PlayMusic(Silence)
~ ChangeScene(TillyBedroom)
{
    - day == 1: -> Bedroom_BedroomOne -> sleep -> class
    - else: WAITING FOR BEDTIME EVENT -> sleep -> class 
}

=== sleep ===
~ PlayMusic(Silence)
~ ChangeScene(Bedroom)
~ AdvanceTime()
~ PlaySound(SleepStinger)
Tilly: Zzzzz.
- ->->