import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  HelpCircle, 
  BookOpen, 
  Users, 
  MessageCircle, 
  Mail, 
  Phone,
  ExternalLink,
  Search
} from 'lucide-react';

export default function Help() {
  const faqItems = [
    {
      question: "How do I publish my first story?",
      answer: "To publish your story, go to the Write page, create your story with a title and description, add your first chapter, and click the 'Publish' button. Make sure to add appropriate tags and select a genre to help readers discover your work."
    },
    {
      question: "How can I gain more readers?",
      answer: "Engage with the community by reading and commenting on other stories, use relevant tags, write compelling descriptions, update regularly, and share your work on social media. Participating in writing contests and challenges can also help increase visibility."
    },
    {
      question: "What are reading lists and how do I use them?",
      answer: "Reading lists are collections of stories you want to save for later. You can create custom lists like 'Favorites', 'To Read Later', or organize by genre. Click the bookmark icon on any story to add it to your lists."
    },
    {
      question: "How do I report inappropriate content?",
      answer: "If you encounter content that violates our community guidelines, click the flag icon on the story or comment. You can also report users by visiting their profile. All reports are reviewed by our moderation team."
    },
    {
      question: "Can I collaborate with other writers?",
      answer: "Yes! You can invite other users to co-write stories. Go to your story settings and add collaborators by their username. All collaborators will be able to add chapters and edit the story."
    },
    {
      question: "How do I change my username?",
      answer: "You can change your username in Settings > Profile Information. Note that your old username will become available for others to use, and any links to your profile will need to be updated."
    },
    {
      question: "What file formats can I upload for covers?",
      answer: "We support JPG, PNG, and GIF formats for story covers. Images should be at least 256x400 pixels for best quality. The recommended ratio is 2:3 (portrait orientation)."
    },
    {
      question: "How do I delete my account?",
      answer: "Account deletion is permanent and cannot be undone. Go to Settings > Danger Zone and click 'Delete Account'. All your stories, comments, and profile data will be permanently removed."
    }
  ];

  const quickLinks = [
    { title: "Getting Started Guide", icon: BookOpen },
    { title: "Community Guidelines", icon: Users },
    { title: "Writing Tips & Tricks", icon: MessageCircle },
    { title: "Copyright & Fair Use", icon: HelpCircle },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Help Center</h1>
          <p className="text-xl text-muted-foreground mb-6">
            Find answers, get support, and learn how to make the most of your writing journey
          </p>
          
          {/* Search */}
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search for help..."
              className="pl-10"
            />
          </div>
        </div>

        {/* Quick Links */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">Popular Topics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quickLinks.map((link, index) => (
              <Card key={index} className="cursor-pointer hover:bg-accent/50 transition-colors">
                <CardContent className="flex items-center gap-4 p-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <link.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{link.title}</h3>
                  </div>
                  <ExternalLink className="w-4 h-4 text-muted-foreground" />
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="w-full">
            {faqItems.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        {/* Contact Support */}
        <section className="mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                Contact Support
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-muted-foreground">
                Can't find what you're looking for? Our support team is here to help.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Email Support</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Get detailed help via email. We typically respond within 24 hours.
                  </p>
                  <Button variant="outline" className="w-full">
                    <Mail className="w-4 h-4 mr-2" />
                    Send Email
                  </Button>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Live Chat</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Chat with our support team for immediate assistance.
                  </p>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" className="flex-1">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Start Chat
                    </Button>
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      Online
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div className="border-t pt-6">
                <h4 className="font-semibold mb-4">Send us a message</h4>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input placeholder="Your name" />
                    <Input placeholder="Your email" type="email" />
                  </div>
                  <Input placeholder="Subject" />
                  <Textarea 
                    placeholder="Describe your issue or question..." 
                    rows={4}
                  />
                  <Button className="w-full">Send Message</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Resources */}
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-6">Additional Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Community Forums</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Connect with other writers and readers in our community forums.
                </p>
                <Button variant="outline" size="sm">
                  Visit Forums
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Video Tutorials</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Watch step-by-step guides on how to use all our features.
                </p>
                <Button variant="outline" size="sm">
                  Watch Videos
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Status Page</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Check the current status of our services and any ongoing issues.
                </p>
                <Button variant="outline" size="sm">
                  Check Status
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
}