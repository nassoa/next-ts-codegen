module.exports = {
  // Répertoire de sortie par défaut pour les fichiers générés
  outputDir: 'src/generated',
  
  // Générer des schémas Zod pour la validation
  generateZodSchemas: true,
  
  // Générer des hooks SWR
  generateSwrHooks: true,
  
  // Générer des hooks React Query
  generateReactQueryHooks: true,
  
  // Préfixe pour les hooks générés (par défaut: 'use')
  hookPrefix: 'use',
  
  // Suffixe pour les types de mutation (par défaut: 'Dto')
  mutationTypeSuffix: 'Dto',
  
  // Configuration des sources de données
  sources: [
    {
      // Chemin vers le fichier source ou URL
      input: 'examples/data.json',
      // Type de source (json, openapi, graphql, etc.)
      type: 'json',
      // Nom du type TypeScript généré
      typeName: 'User',
      // Options spécifiques au type de source
      options: {
        // Pour les sources JSON, vous pouvez spécifier le chemin vers les données si elles sont imbriquées
        dataPath: 'users',
        // Si vous voulez générer des types pour chaque élément du tableau
        generateForEachItem: false,
        // Si vous voulez ignorer certains champs
        exclude: ['metadata'],
        // Si vous voulez ajouter des champs personnalisés
        addFields: {
          // Ajoute un champ calculé qui n'existe pas dans les données d'origine
          fullName: 'string',
        },
        // Configuration des hooks pour cette source
        hooks: {
          // Activer/désactiver les hooks pour cette source spécifiquement
          enabled: true,
          // Préfixe personnalisé pour les hooks de cette source
          prefix: 'useUser',
          // Options spécifiques aux hooks
          options: {
            // URL de base pour les appels API
            baseUrl: '/api/users',
            // Activer les mutations (POST, PUT, DELETE)
            enableMutations: true,
            // Activer les requêtes par ID
            enableGetById: true,
            // Activer la liste paginée
            enablePagination: true,
          },
        },
        // Options spécifiques au parseur JSON
      }
    }
  ]
};
