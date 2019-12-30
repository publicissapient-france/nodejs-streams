# Implémenter et consommer les Streams "Readable" et "Writable" de Node.js

Vous pouvez exécuter les demos avec la commande suivante :

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

### Demos du ReadableCounter

- src/readable/demos/pipe.ts
- src/readable/demos/data.ts
- src/readable/demos/readable.ts
- src/readable/demos/data-and-readable.ts

## Stream "Writable"

### Implémentation et tests du WritableLogger

- src/writable/logger.ts
- src/writable/logger.test.ts

### Demos du WritableLogger

- src/writable/demos/feed-simple.ts
- src/writable/demos/feed.ts

## Pipe des Streams "Readable" et "Writable"

- src/pipe/index.ts

## Gestion des erreurs

- src/error/index.ts
- src/error/index.test.ts

## Server HTTP

- src/server/index.ts
