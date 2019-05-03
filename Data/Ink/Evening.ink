=== evening ===
{ 
    - currentRoom == RecRoom: 
        -> recroom
    - currentRoom == ExerciseRoom: 
        -> exerciseroom
    - currentRoom == Library: 
        -> library
    - else: 
        You spend all evening here, but nothing happens.
}
- -> bedtime

= recroom
~ Meet(Sitari)
{
    - day == 1: -> SitariRecRoomEvening1
    - else: This is the end of the demo! -> DONE
}
->->

= exerciseroom
~ Meet(Max)
This is the end of the demo! -> DONE
->->

= library
~ Meet(Kitty)
This is the end of the demo! -> DONE
->->

=== bedtime ===
~ AdvanceTime()
~ PlayMusic(Silence)
~ ChangeScene(TillyBedroom)
WAITING FOR BEDTIME EVENT
SOME CHOICES HERE
-> sleep -> class

=== sleep ===
~ PlayMusic(Silence)
~ ChangeScene(Bedroom)
~ AdvanceTime()
~ PlaySound(SleepStinger)
Tilly: Zzzzz.
- ->->