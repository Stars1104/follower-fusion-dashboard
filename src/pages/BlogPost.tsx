
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Edit2, Calendar, User, Tag } from 'lucide-react';
import { BlogPost } from '@/types/blog';

const BlogPostPage = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Mock data for demo
  const mockCategories = [
    { id: '1', name: 'Growth Strategies', slug: 'growth-strategies' },
    { id: '2', name: 'Engagement', slug: 'engagement' },
    { id: '3', name: 'Algorithm', slug: 'algorithm' },
    { id: '4', name: 'Case Studies', slug: 'case-studies' },
  ];

  useEffect(() => {
    // Simulate API call
    setLoading(true);
    setTimeout(() => {
      // This would be an API call in a real application
      const mockPosts: BlogPost[] = [
        {
          id: '1',
          title: 'How to Grow Your Instagram Following in 2023',
          slug: 'grow-instagram-following-2023',
          excerpt: 'Learn the latest strategies to grow your Instagram audience organically.',
          content: `
# How to Grow Your Instagram Following in 2023

Instagram remains one of the most powerful platforms for businesses and individuals looking to build an audience. However, with algorithm changes and increased competition, growing your following requires strategic approaches.

## Focus on Reels

Short-form video content is dominating Instagram in 2023. Reels receive preferential treatment in the algorithm and can help you reach a much wider audience than standard posts.

## Consistency is Key

Posting regularly helps the algorithm recognize your account as active and worthy of promotion. Aim for 3-5 posts per week at minimum.

## Engage Authentically

Spend time each day engaging with your audience and similar accounts. Genuine interaction builds community and signals to Instagram that your account is providing value.

## Use Hashtags Strategically

Research hashtags that are relevant to your niche but not oversaturated. Using 5-10 targeted hashtags is more effective than using 30 random ones.

## Collaborate with Others

Partner with complementary accounts for shoutouts, takeovers, or joint content. This exposes you to new, relevant audiences.
          `,
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
          content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
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
          content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
          imageUrl: '/placeholder.svg',
          categoryId: '3',
          createdAt: '2023-07-10T08:45:00Z',
          updatedAt: '2023-07-10T08:45:00Z',
          published: false
        }
      ];
      
      const foundPost = mockPosts.find(p => p.id === postId);
      setPost(foundPost || null);
      setLoading(false);
    }, 1000);
  }, [postId]);

  const getCategoryName = (categoryId: string) => {
    const category = mockCategories.find(cat => cat.id === categoryId);
    return category ? category.name : 'Uncategorized';
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate('/blog')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="h-8 w-48 bg-muted animate-pulse rounded-md"></div>
        </div>
        <Card className="p-6">
          <div className="space-y-4">
            <div className="h-8 w-3/4 bg-muted animate-pulse rounded-md"></div>
            <div className="h-6 w-1/2 bg-muted animate-pulse rounded-md"></div>
            <div className="h-64 w-full bg-muted animate-pulse rounded-md"></div>
          </div>
        </Card>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate('/blog')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Post Not Found</h1>
        </div>
        <Card className="p-6 text-center py-12">
          <p className="text-muted-foreground mb-4">The blog post you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate('/blog')}>
            Back to Blog
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate('/blog')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Blog Post</h1>
        </div>
        <Button onClick={() => navigate(`/blog?edit=${post.id}`)}>
          <Edit2 className="mr-2 h-4 w-4" />
          Edit Post
        </Button>
      </div>
      
      <Card className="p-6 relative">
        <Tabs defaultValue="preview">
          <TabsList className="mb-4">
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="editor">Editor</TabsTrigger>
          </TabsList>
          
          <TabsContent value="preview" className="space-y-6">
            <div className="relative aspect-[2/1] w-full overflow-hidden rounded-lg">
              <img 
                src={post.imageUrl} 
                alt={post.title} 
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/placeholder.svg';
                }}
              />
            </div>
            
            <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{new Date(post.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                <span>Admin</span>
              </div>
              <div className="flex items-center gap-1">
                <Tag className="h-4 w-4" />
                <span>{getCategoryName(post.categoryId)}</span>
              </div>
            </div>
            
            <div>
              <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
              <p className="text-lg text-muted-foreground mb-6">{post.excerpt}</p>
              
              <div className="prose max-w-none dark:prose-invert">
                {post.content.split('\n').map((paragraph, index) => {
                  if (paragraph.startsWith('# ')) {
                    return <h1 key={index} className="text-2xl font-bold mt-6 mb-4">{paragraph.slice(2)}</h1>;
                  } else if (paragraph.startsWith('## ')) {
                    return <h2 key={index} className="text-xl font-bold mt-5 mb-3">{paragraph.slice(3)}</h2>;
                  } else if (paragraph.startsWith('### ')) {
                    return <h3 key={index} className="text-lg font-bold mt-4 mb-2">{paragraph.slice(4)}</h3>;
                  } else if (paragraph.trim() === '') {
                    return <br key={index} />;
                  } else {
                    return <p key={index} className="mb-4">{paragraph}</p>;
                  }
                })}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="editor">
            <div className="font-mono text-sm p-4 bg-muted rounded-md whitespace-pre-wrap overflow-x-auto">
              {post.content}
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default BlogPostPage;
