# Comprendre les Streams "Readable" et "Writable" en Node.js

Les Streams sont à la base de Node.js !

Si vous avez touché à Node.js, vous avez certainement manipulé des Streams, sans forcément vous en rendre compte...

A titre d'exemples, HTTP Request/Response, TCP Socket, fs read, zlib et crypto, sont tous des Streams.

Si vous souhaitez mettre dans votre CV "Je suis un développeur Node.js", vous ne pouvez pas vous contenter de connaitre le framework Express et autres packages NPM non moins indispensables.

Vous serez au mieux un "Développeur NPM", mais je ne suis pas sûr qu'un tel poste existe vraiment (à vérifier)...

Ca serait un peu comme si vous vouliez être un développeur JavaScript avec seulement jQuery dans votre arsenal (ça vous rappelle quelque chose ?)...

Alors, si vous vous voulez vraiment être à l'aise avec les Streams et devenir un développeur Node.js, vous êtes au bon endroit !

Dans cet article, je vais vous montrer en détail le fonctionnement des Streams Readable et Writable. Vous allez comprendre leur fonctionnement interne et vous saurez les produire et les consommer.

Et pour que tout cela soit vraiment fun, nous allons utiliser TypeScript comme langage de programmation et Jest comme framework de test.

## Mais alors un Stream c'est quoi ?

Un Stream c'est un flot de données de taille inconnue et dont le contenu est accessible par paquets émis de manière asynchrone au fil du temps.

On peut l'opposer au Buffer.

Un Buffer est un bloc de données de taille connue à l'avance et dont le contenu est accessible de manière synchrone.

## Readable Stream

Produire le Stream

```ts
import { Readable, ReadableOptions } from 'stream';

class ReadableCounter extends Readable {
  data = 0;

  constructor(public dataLimit: number, options?: ReadableOptions) {
    super(options);
  }

  _read(): void {
    this.data += 1;

    if (this.data <= this.dataLimit) {
      this.push(this.data.toString());
    } else {
      this.push(null);
    }
  }
}
```

Consommer le Stream

```ts
const stream = new ReadableCounter(6);

stream.pipe(process.stdout);

// Console output: 123456
```
