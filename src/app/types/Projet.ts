export type Projet = {
    id: string;
    fields: {
      name: string;
      description: string;
      technologies: { id: string; name: string }[];
      lien: string;
      promotion: string;
      students:  string;
      category: { id: string; name: string }[];
    };
  };