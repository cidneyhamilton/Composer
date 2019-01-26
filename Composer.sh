#!/bin/bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

ARG=$DIR
while [[ "$ARG" != "." && "$ARG" != "/" ]]
do
#	ls -ld -- "$ARG"
	ARG=`dirname -- "$ARG"`
done

WAIT=
if [[ $1 == batchBuild ]]; then
  WAIT=-W
fi

#echo "open -n $WAIT -a node-webkit \"$DIR\"" $1
open -n $WAIT -a node-webkit --args "$DIR" $1
