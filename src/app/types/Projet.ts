export type Projet = {
    id: string;
    fields: {
      name: string;
      description: string;
      technologies: { id: string; name: string }[];
      link: string;
      promotion: string;
      students:  string;
      admin_comment?:  string;
      category: { id: string; name: string }[];
      liked_by?: string[];
      visible?:  boolean;
    };
  };