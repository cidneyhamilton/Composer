VAR DinnerActors = (Fritz, Mooella, Max, Kitty, Sitari, Rodrigo)

=== dinner ===
~ PlayMusic(DiningHall)
~ ChangeScene(DiningHall)
~ SetupDiningHall()
-> DinnerChoice

=== DinnerChoice ===
+   { DinnerActors ? Rodrigo } Sit With Rodrigo
    -> DinnerRodrigo
+   { DinnerActors ? Sitari } Sit With Sitari
    -> DinnerSitari
+   { DinnerActors ? Kitty } Sit With Kitty
    -> DinnerKitty
+   { DinnerActors ? Max } Sit With Max
    -> DinnerMax
+   { DinnerActors ? Fritz } Sit With Fritz
    -> DinnerFritz
    
    
=== DinnerRodrigo ===
{
    - day == 1: -> DinnerRodrigo1
    - else: This is the end of the demo! ->->
}

=== DinnerKitty ===
{
    - day == 1: -> DinnerKitty1
    - else: This is the end of the demo! ->->
}

=== DinnerFritz ==
{
    - day == 1: -> DinnerFritz1
    - else: This is the end of the demo! ->->
}

=== DinnerSitari ===
{
    - day == 1: -> DinnerSitari1
    - else: This is the end of the demo! ->->
}

=== DinnerMax ===
{
    - day == 1: -> DinnerMax1
    - else: This is the end of the demo! ->->
}

=== function CanSitWith(Actor) ===
    ~ return MetPrev == Actor || MetLast == Actor


=== function SetupDiningHall ===
// Determines who is available in the dining hall
~ DinnerActors = ()
~ DinnerActors = (Fritz)

{
    - CanSitWith(Mooella):
    ~ DinnerActors += Mooella
}
{
    - CanSitWith(Max):
    ~ DinnerActors += Max
}
{
    - CanSitWith(Kitty):
    ~ DinnerActors += Kitty
}
{
    - CanSitWith(Sitari):
    ~ DinnerActors += Sitari
}
{
    - CanSitWith(Rodrigo):
    ~ DinnerActors += Rodrigo
}