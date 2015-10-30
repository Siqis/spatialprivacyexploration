Usage: ansible-playbook -i inventory/hosts deployment.yml --private-key <private-key file>

-put ip address of the instance(s) to the corresponding group in inventory/hosts
-make sure that the private key file is in pem format and applies to ssh connection to all managed nodes
-refer to appendix section of the report for detailed documentation