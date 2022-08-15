#Инструкция

1) Вызываем команды
- kubectl create ns otus
- helm install helm/otus --namespace otus
- kubectl set-context --current --namespace=otus
- kubectl get all (для проверки, что всё запустилось)

2) Заходим в папку Postman и вызываем команду newman run collection.js