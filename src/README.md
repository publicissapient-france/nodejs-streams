# Implémenter et consommer les Streams "Readable" et "Writable" de Node.js

Vous pouvez exécuter les démos avec la commande suivante :

```bash
./node_modules/.bin/ts-node [path/to/file.ts]
```

Ou lancer les tests avec la commande suivante :

```bash
npm test
```

## Stream "Readable"

### Implémentation et tests du ReadableCounter

- src/readable/counter.ts
- src/readable/counter.test.ts

### Démos du ReadableCounter

- src/readable/demos/1-data.ts
- src/readable/demos/2-pipe.ts
- src/readable/demos/3-data-pipe.ts
- src/readable/demos/4-readable.ts
- src/readable/demos/5-readable-and-data.ts

_La démo `3-data-pipe.ts` émule le comportement de la méthode `pipe()` en utilisant les événements `data`._

_La démo `5-readable-and-data.ts` montre que lorsque le consommateur s'abonne aux événements `readable` et `data`, le Stream est mode `"paused"`. C'est donc l'abonnement aux événements `readable` qui prime et détermine le mode de fonctionnement du Stream._

## Stream "Writable"

### Implémentation et tests du WritableLogger

- src/writable/logger.ts
- src/writable/logger.test.ts

### Démos du WritableLogger

- src/writable/demos/feed-simple.ts
- src/writable/demos/feed.ts

_Les deux démos ont le même comportement et diffèrent seulement par leur implémentation_

## Pipe des Streams "Readable" et "Writable"

- src/pipe/index.ts

## Gestion des erreurs

- src/error/index.ts
- src/error/index.test.ts

## Server HTTP

- src/server/index.ts
