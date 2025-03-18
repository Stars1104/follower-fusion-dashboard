
export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  imageUrl: string;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
  published: boolean;
}
