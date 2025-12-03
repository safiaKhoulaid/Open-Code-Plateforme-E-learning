# Implémentation des Pièces Jointes pour les Cours

Cette fonctionnalité permet aux enseignants d'ajouter plusieurs pièces jointes lors de la création ou modification d'un cours.

## Structure de la Base de Données

Une nouvelle table `course_resources` a été créée avec les champs suivants :

- `id` - Clé primaire
- `course_id` - Clé étrangère vers la table `courses`
- `title` - Titre de la ressource
- `type` - Type de ressource (PDF, DOCUMENT, VIDEO, AUDIO, LINK)
- `file_url` - URL du fichier ou lien externe
- `file_size` - Taille du fichier (en octets)
- `is_downloadable` - Indique si la ressource est téléchargeable
- `created_at` et `updated_at` - Timestamps

## Modèles

### CourseResource

Un nouveau modèle `CourseResource` a été créé pour représenter les pièces jointes des cours. Ce modèle a une relation `belongsTo` avec le modèle `Course`.

### Course

Le modèle `Course` a été mis à jour pour inclure une relation `hasMany` avec le modèle `CourseResource`.

## Validation

Une classe de requête `CourseResourceRequest` a été créée pour valider les données envoyées par le frontend. Cette classe valide :

- Un tableau de pièces jointes (`resourceAttachments`)
- Pour chaque pièce jointe :
  - Un titre obligatoire
  - Un type obligatoire (PDF, DOCUMENT, VIDEO, AUDIO, LINK)
  - Un fichier obligatoire pour les types PDF, DOCUMENT, VIDEO, AUDIO
  - Une URL obligatoire pour le type LINK
  - Un indicateur de téléchargement (booléen)

## Contrôleur

Le contrôleur `CourseResourceController` a été créé avec les méthodes suivantes :

- `store` - Ajoute plusieurs pièces jointes à un cours
- `update` - Met à jour une pièce jointe existante
- `destroy` - Supprime une pièce jointe
- `download` - Télécharge une pièce jointe

## Routes API

Les routes suivantes ont été ajoutées :

- `POST /api/teacher/courses/{course}/resources` - Ajoute des pièces jointes à un cours
- `PUT /api/teacher/courses/{course}/resources/{resource}` - Met à jour une pièce jointe
- `DELETE /api/teacher/courses/{course}/resources/{resource}` - Supprime une pièce jointe
- `GET /api/courses/{course}/resources/{resource}/download` - Télécharge une pièce jointe

Les routes de gestion sont protégées par le middleware `role:teacher` pour s'assurer que seuls les enseignants peuvent gérer les pièces jointes.

## Exemples

### Requête

```json
{
  "resourceAttachments": [
    {
      "title": "Introduction au cours",
      "type": "PDF",
      "file": "[File Object]",
      "is_downloadable": true
    },
    {
      "title": "Vidéo explicative",
      "type": "VIDEO",
      "file": "[File Object]",
      "is_downloadable": true
    },
    {
      "title": "Ressource externe",
      "type": "LINK",
      "file_url": "https://example.com/resource",
      "is_downloadable": false
    }
  ]
}
```

### Réponse

```json
{
  "message": "Ressources ajoutées avec succès",
  "resources": [
    {
      "id": 1,
      "course_id": 123,
      "title": "Introduction au cours",
      "type": "PDF",
      "file_url": "storage/course_resources/introduction_cours.pdf",
      "file_size": 1024000,
      "is_downloadable": true,
      "created_at": "2023-05-01T10:00:00.000000Z",
      "updated_at": "2023-05-01T10:00:00.000000Z"
    },
    {
      "id": 2,
      "course_id": 123,
      "title": "Vidéo explicative",
      "type": "VIDEO",
      "file_url": "storage/course_resources/video_explicative.mp4",
      "file_size": 15360000,
      "is_downloadable": true,
      "created_at": "2023-05-01T10:00:00.000000Z",
      "updated_at": "2023-05-01T10:00:00.000000Z"
    },
    {
      "id": 3,
      "course_id": 123,
      "title": "Ressource externe",
      "type": "LINK",
      "file_url": "https://example.com/resource",
      "file_size": null,
      "is_downloadable": false,
      "created_at": "2023-05-01T10:00:00.000000Z",
      "updated_at": "2023-05-01T10:00:00.000000Z"
    }
  ]
}
```

## Utilisation côté Frontend

Pour utiliser cette fonctionnalité côté frontend, vous devez :

1. Créer un formulaire qui permet d'ajouter plusieurs pièces jointes
2. Envoyer les données au format multipart/form-data
3. Gérer les différents types de pièces jointes (fichiers vs liens)
4. Afficher les pièces jointes associées à un cours

## Migration

Pour appliquer la migration, exécutez la commande suivante :

```bash
php artisan migrate
```