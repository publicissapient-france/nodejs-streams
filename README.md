# Implémenter et consommer des Streams "Readable" et "Writable" en Node.js

Les Streams sont une brique fonctionnelle essentielle de Node.js !

Si vous avez touché à Node.js, vous avez certainement manipulé des Streams, sans forcément vous en rendre compte... A titre d'exemples, HTTP Request/Response, TCP Socket, fs read, zlib et crypto, implémentent tous l'interface Streams.

Si vous souhaitez mettre dans votre CV "Développeur Node.js", vous ne pouvez pas vous contenter de connaitre le framework Express et autres packages NPM non moins indispensables. Vous serez au mieux un "Développeur NPM", mais je ne suis pas sûr qu'un tel poste existe vraiment (à vérifier)... Ce serait un peu comme si vous vouliez être un développeur JavaScript avec seulement jQuery dans votre arsenal (ça vous rappelle peut-être quelque chose ?). Alors, si vous vous voulez vraiment être à l'aise avec les Streams et devenir un Ninja en Node.js, vous êtes au bon endroit !

Dans cet article, je vais vous montrer en détail le fonctionnement des Streams "Readable" et "Writable". Vous allez comprendre leur fonctionnement interne et vous saurez en implémenter et en consommer.

Et pour que tout cela soit vraiment fun, nous allons utiliser TypeScript comme langage de programmation et Jest comme framework de test.

## Mais alors un Stream c'est quoi ?

Un __Stream__, c'est un flot de données de __taille inconnue__ et dont le contenu est accessible par paquets ("chunk" en anglais), émis de manière __asynchrone__ au fil du temps. On peut l'opposer au Buffer. Un __Buffer__ est un bloc de données de __taille connue__ à l'avance et dont le contenu est accessible de manière __synchrone__.

En fait, en interne un Stream utilise justement un Buffer comme zone tampon pour stocker les chunks qu'il détient.

Si un Stream produit des chunks, qu'il stocke donc dans son Buffer interne en vue de leur consommation, on dit alors que ce Stream est accessible en lecture (ou "Readable"). Et si vous pouvez pousser des chunks dans le Buffer interne d'un Stream en vue de leur traitement, on dit alors que ce Stream est est accessible en écriture (ou "Writable").

Mais un Stream c'est aussi un émetteur d'événements (ou "EventEmitter"). Par exemple, un Stream "Readable" va emettre des événements "readable" pour indiquer au consommateur que de la donnée est prête à être consommée.

En résumé, l'équation est assez simple : Buffer + EventEmitter = Stream.

## Readable Stream

### Les modes "paused" et "flowing"

Au départ, un Stream est en mode pause ("paused").

...

Un Stream Readable est un flot de données accessible en lecture.

Pour produire un tel Stream, vous devez créer une classe qui hérite de la classe `Readable` et implémenter la méthode `_read` de son interface.

Comment ça marche ?

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

stream.pipe(process.stdout); // Console output: 123456
```
