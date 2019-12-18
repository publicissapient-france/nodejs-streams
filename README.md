# Implémenter et consommer les Streams "Readable" et "Writable" de Node.js

![Streams](./img/stream.jpg)

Les [Streams](https://nodejs.org/api/stream.html) sont une des briques fonctionnelles essentielles de l'écosystème [Node.js](https://nodejs.org/) !

Si vous avez touché à Node.js, vous avez certainement manipulé des Streams, sans forcément vous en rendre compte... A titre d'exemples, `HTTP Request/Response`, `TCP Socket`, `fs read`, `zlib` et `crypto`, implémentent tous l'interface Streams.

Si vous souhaitez mettre dans votre CV "Développeur Node.js", vous ne pouvez pas vous contenter de connaitre le framework Express et autres packages NPM non moins indispensables. Vous serez au mieux un "Développeur NPM", mais je ne suis pas sûr qu'un tel poste existe vraiment (à vérifier)... Ce serait un peu comme si vous vouliez être un développeur JavaScript avec seulement jQuery dans votre arsenal (ça vous rappelle peut-être quelque chose). Alors, si vous vous voulez vraiment être à l'aise avec les Streams et devenir un Ninja en Node.js, vous êtes au bon endroit !

__Dans cet article, je vais vous expliquer jusqu'en détail le fonctionnement interne des Streams "Readable" et "Writable" et vous serez ensuite à l'aise pour les implémenter et les consommer.__

Et pour que tout cela soit vraiment fun, je vais utiliser [TypeScript](https://www.typescriptlang.org) comme langage de programmation et [Jest](https://jestjs.io) comme framework de test.

Les exemples de code de cet article sont disponibles sur le dépôt suivant :
[https://github.com/xebia-france/nodejs-streams](https://github.com/xebia-france/nodejs-streams).

Mais avant de coder, commonçons par définir ce qu'est un Stream.

## Mais alors un Stream c'est quoi ?

Un __[Stream](https://nodejs.org/api/stream.html)__ est un flot de données de __taille inconnue__ dont le contenu est accessible par paquets ("chunk" en anglais) au fil du temps de manière __asynchrone__. On peut l'opposer au Buffer. Un __[Buffer](https://nodejs.org/api/buffer.html)__ est un bloc de données de __taille connue__ à l'avance et dont le contenu est accessible de manière __synchrone__.

En fait, en interne un Stream utilise justement un Buffer comme zone tampon pour stocker les chunks qu'il détient.

Lorsqu'un Stream produit des chunks, qu'il stocke donc dans son Buffer interne en vue de leur consommation, on dit que ce Stream est accessible en lecture (ou "Readable"). Et lorsque vous pouvez pousser des chunks dans le Buffer interne d'un Stream en vue de leur traitement, on dit que ce Stream est accessible en écriture (ou "Writable").

Mais un Stream c'est aussi un émetteur d'événements (ou "[EventEmitter](https://nodejs.org/api/events.html)"), auxquels vous allez pouvoir vous abonner pour le suivre tout au long de son cycle de vie. Par exemple, un Stream "Readable" va emettre un événement `"readable"`, pour indiquer à celui qui le consomme, que de la donnée est prête à être consommée.

En résumé, l'équation est assez simple : __Buffer + EventEmitter = Stream__.

Après cette introduction, passons à la pratique.

## Les Streams Readable

Pour cette partie, vous allez implémenter un Stream nommé `ReadableCounter` qui émet des nombres de 1 à 6, puis se termine.

Pour cela, vous devez créer une classe enfant qui hérite de la classe `Readable`, dont le contrat d'interface vous demande d'implémenter la méthode `_read()`. Le rôle de la méthode `_read()` est d'émettre des chunks en appelant au moins une fois la méthode `push()` (pour chaque appel à `_read()`) de manière synchrone ou asynchrone. Et pour terminer le Stream, vous devez appeler cette méthode `push()` avec `null` en paramètre.

```ts
import { Readable } from 'stream';

class ReadableCounter extends Readable {
  data = 0;

  _read() {
    this.data += 1;

    if (this.data <= 6) {
      this.push(this.data.toString());
    } else {
      this.push(null);
    }
  }
}
```

Le consommateur de votre Stream ne va pas appeler directement la méthode `_read()`, considérée comme privée. C'est Node.js qui va l'appeler pour lui, au moment qu'il juge opportun.

Nous allons revenir sur ce point essentiel un peu plus loin, mais voyons tout d'abord comment consommer votre Stream.

### Les modes "paused" et "flowing"

Un Stream Readable a 2 états possibles : à l'arrêt ("paused") ou en train de s'écouler ("flowing"). Et paradoxalement, on peut le consommer dans l'un comme dans l'autre de ses états (et donc même s'il est en mode "paused") ! La méthode `isPaused()` permet de récupérer cet état.

A sa création un Stream Readable est en mode "paused".

Le plus naturel consiste à passer le Stream en mode "flowing" pour que celui-ci se mette à émettre des chunks.
Pour cela, le consommateur peut se mettre à l'écoute des événements `"data"` ou appeler la méthode `resume()`.

```ts
const readable = new ReadableCounter();

console.log(readable.isPaued()); // = true

readable.on('data', chunk => {
  // Faire quelque chose avec `chunk`...

  console.log(readable.isPaued()); // = false
});
```

```ts
const readable = new ReadableCounter();

console.log(readable.isPaued()); // = true

readable.resume();

console.log(readable.isPaued()); // = false
```

Dans ce cas, le Stream se comporte simplement comme un EventEmitter et les chunks ne transitent pas par le Buffer interne.
Ce comportement est comparable au "push notifications" des WebSockets.

Notez qu'en utilisant seulement la méthode `resume()`, les chunks sont émis et donc perdus puisque personne ne les récupère.

L'autre manière de consommer le Stream est en le laissant en mode "paused".
Pour cela, le consommateur doit se mettre à l'écoute de l'événement `"readable"` (ou appeler la méthode `pause()` si le Stream était en mode "flowing").

```ts
const readable = new ReadableCounter();

console.log(readable.isPaued()); // = true

readable.on('readable', () => {
  const chunk = readable.read();
  // Faire quelque chose avec `chunk`...

  console.log(readable.isPaued()); // = true
});
```

Dans ce cas, le Stream emet les chunks en les stockant dans son Buffer interne.
C'est au consommateur d'appeler la méthode public `read()` (sans "_") pour tirer la donnée.

Ce comportement est comparable au "pull notifications" d'une API Rest.

Revenons maintenant à la méthode privée `_read()`. A quel moment est-elle appelée par Node.js ?

### Séquence des appels à `_read()`

La méthode `_read()` est appelée pour la première fois lorsque le consommateur se met à l'écoute des événements `"data"` ou `"readable"`.

Le contrat de la méthode `_read()` est comme nous l'avons dit plus haut d'appeler au moins une fois, de manière synchrone ou pas, la méthode `push()`.

Une fois ce contrat rempli, Node.js rappelle la méthode `_read()` pour demander à votre Stream de nouveaux chunks, et ainsi de suite.

Ce cercle "vertueux" n'est interrompu que lorsque vous applez `push()` avec `null` en paramètre pour indiquer que le Stream est terminé.






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
