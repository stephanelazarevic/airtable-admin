export type Projet = {
    id: string;
    fields: {
      name: string;
      description: string;
      technologies: { id: string; name: string }[];
      link: string;
      promotion: string;
      students:  string;
      admin_comments?:  string;
      category: { id: string; name: string }[];
      liked_by?: string[];
      visible?:  boolean;
    };
  };