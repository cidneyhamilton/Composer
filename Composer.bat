@echo off
cd Platforms\Windows\

set BatchBuild=
set DebugOption=
set DemoOption=
set Game=heroU

REM ==========================================================
REM Command line parser. Kind of goofy
REM but we need to block on composer being done
REM but don't want to do that when running as a GUI.
:CMDNEXT
if "%1" == "" ( 
	goto CMDEND 
) 
if "%1" == "batchBuild" ( 
	set BatchBuild=batchBuild
)
if "%1" == "debug" ( 
	set DebugOption=debug
)
if "%1" == "demo" ( 
	set DemoOption=demo
)
if "%1" == "heroU" (
	set Game=heroU
)
if "%1" == "SummerDazeM" (
	set Game=SummerDazeM
)
if "%1" == "SummerDazeF" (
	set Game=SummerDazeF
)
if "%1" == "r2rDemo" (
	set Game=r2rDemo
)
if "%1" == "wizardsWay" (
	set Game=wizardsWay
)
shift
goto CMDNEXT
:CMDEND
REM ==========================================================
REM We can run in batch mode automatically
REM In that mode we run a build and shut down the
REM we also block till completed while otherwise
REM we start up and let it run happily.
if "%BatchBuild%" == "batchBuild" (
	echo .
	echo .   BATCH BUILD
	echo .
	start /WAIT nw ..\..\ %BatchBuild% %DebugOption% %DemoOption% %Game%
) ELSE (
	echo GUI MODE
	start nw ..\..\ 
	exit
)
