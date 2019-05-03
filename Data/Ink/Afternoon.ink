=== afternoon ===
{ 
    - currentRoom == ExerciseRoom: 
        ~ Meet(Max)
        -> exercise -> dinnertime
    - currentRoom == Library: 
        ~ Meet(Fritz)
        -> library -> dinnertime
    - currentRoom == PracticeField: 
        ~ Meet(Mooella)
        -> practice_field -> dinnertime
    - currentRoom == Workshop: 
        ~ Meet(Kitty)
        -> workshop -> dinnertime
    - else: 
        You spend all afternoon here, but nothing happens.
}

= exercise
{
    - day == 1: -> MaxExerciseDaytime1
    - else: This is the end of the demo! -> DONE
}
->->

= library
{
    - day == 1: -> LibraryDaytime1
    - else: This is the end of the demo! -> DONE
}
->->

= practice_field
{
    - day == 1: -> PracticeFieldDaytime1
    - else: This is the end of the demo! -> DONE
}
->->

= workshop
{
    - day == 1: -> WorkshopDaytime1 
    - else: This is the end of the demo! -> DONE
}
->->

