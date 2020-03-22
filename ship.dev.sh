#!/bin/bash

docker build -t advocat .

docker save -o advocat.tar

scp advocat.tar -i $(DEPLOY_KEY) $(DEPLOY_USER)@$(DEPLOY_TARGET):/advocat.tar