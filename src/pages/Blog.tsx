
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  PlusCircle, 
  Search, 
  FileText, 
  Calendar, 
  Tag,
  Edit2,
  Trash2,
  Eye,
  EyeOff
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { BlogDialog } from '@/components/blog/BlogDialog';
import { BlogDeleteDialog } from '@/components/blog/BlogDeleteDialog';
import { BlogPost } from '@/types/blog';

// Mock blog data
const mockPosts: BlogPost[] = [
  {
    id: '1',
    title: 'How to Grow Your Instagram Following in 2023',
    slug: 'grow-instagram-following-2023',
    excerpt: 'Learn the latest strategies to grow your Instagram audience organically.',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    imageUrl: '/placeholder.svg',
    categoryId: '1',
    createdAt: '2023-05-15T10:00:00Z',
    updatedAt: '2023-05-15T10:00:00Z',
    published: true
  },
  {
    id: '2',
    title: 'The Power of Instagram Likes for Brand Engagement',
    slug: 'power-instagram-likes-brand-engagement',
    excerpt: 'Discover how Instagram likes can boost your brand engagement metrics.',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    imageUrl: '/placeholder.svg',
    categoryId: '2',
    createdAt: '2023-06-22T14:30:00Z',
    updatedAt: '2023-06-23T09:15:00Z',
    published: true
  },
  {
    id: '3',
    title: 'Instagram Algorithm Updates: What You Need to Know',
    slug: 'instagram-algorithm-updates-guide',
    excerpt: 'Stay up to date with the latest Instagram algorithm changes and how they affect your content.',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    imageUrl: '/placeholder.svg',
    categoryId: '3',
    createdAt: '2023-07-10T08:45:00Z',
    updatedAt: '2023-07-10T08:45:00Z',
    published: false
  }
];

// Mock categories
const categories = [
  { id: '1', name: 'Growth Strategies', slug: 'growth-strategies' },
  { id: '2', name: 'Engagement', slug: 'engagement' },
  { id: '3', name: 'Algorithm', slug: 'algorithm' },
  { id: '4', name: 'Case Studies', slug: 'case-studies' },
];

const Blog = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [posts, setPosts] = useState<BlogPost[]>(mockPosts);

  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreatePost = (post: BlogPost) => {
    const newPost = {
      ...post,
      id: (posts.length + 1).toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setPosts([newPost, ...posts]);
    setIsCreateDialogOpen(false);
  };

  const handleEditPost = (post: BlogPost) => {
    setPosts(posts.map(p => p.id === post.id ? {...post, updatedAt: new Date().toISOString()} : p));
    setIsEditDialogOpen(false);
    setSelectedPost(null);
  };

  const handleDeletePost = (postId: string) => {
    setPosts(posts.filter(post => post.id !== postId));
    setIsDeleteDialogOpen(false);
    setSelectedPost(null);
  };

  const handleTogglePublish = (postId: string) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? {...post, published: !post.published, updatedAt: new Date().toISOString()} 
        : post
    ));
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : 'Uncategorized';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <h1 className="text-2xl font-bold">Blog Management</h1>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Create New Post
        </Button>
      </div>

      <Card className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search posts..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </Card>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPosts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                  <FileText className="mx-auto h-10 w-10 mb-2 opacity-30" />
                  <p>No blog posts found</p>
                </TableCell>
              </TableRow>
            ) : (
              filteredPosts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell className="font-medium">{post.title}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{getCategoryName(post.categoryId)}</Badge>
                  </TableCell>
                  <TableCell className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                    {new Date(post.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {post.published ? (
                      <Badge variant="outline" className="bg-green-100 text-green-800">Published</Badge>
                    ) : (
                      <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Draft</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-more-vertical">
                            <circle cx="12" cy="12" r="1" />
                            <circle cx="12" cy="5" r="1" />
                            <circle cx="12" cy="19" r="1" />
                          </svg>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => navigate(`/blog/${post.id}`)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => {
                            setSelectedPost(post);
                            setIsEditDialogOpen(true);
                          }}
                        >
                          <Edit2 className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleTogglePublish(post.id)}
                        >
                          {post.published ? (
                            <>
                              <EyeOff className="mr-2 h-4 w-4" />
                              Unpublish
                            </>
                          ) : (
                            <>
                              <Eye className="mr-2 h-4 w-4" />
                              Publish
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => {
                            setSelectedPost(post);
                            setIsDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      <BlogDialog 
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        categories={categories}
        onSave={handleCreatePost}
      />

      {selectedPost && (
        <BlogDialog 
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          categories={categories}
          post={selectedPost}
          onSave={handleEditPost}
        />
      )}

      {selectedPost && (
        <BlogDeleteDialog 
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          postTitle={selectedPost.title}
          onDelete={() => handleDeletePost(selectedPost.id)}
        />
      )}
    </div>
  );
};

export default Blog;
