export interface MockTask {
  id: string;
  title: string;
  description?: string;
  hasNotification?: boolean;
  timeAgo?: string;
  category: 'pending' | 'today' | 'yesterday';
}

export interface MockPinnedCard {
  id: string;
  title: string;
  description?: string;
  type: 'website' | 'metric' | 'task';
  image?: string;
  score?: number;
  status?: string;
  timeAgo?: string;
}

export const getAgentTasks = (agentId: string | null): MockTask[] => {
  const tasksByAgent: Record<string, MockTask[]> = {
    'visualeditor': [
      { id: 've1', title: 'Create responsive homepage layout', description: 'Design a modern homepage with hero section and product showcase', hasNotification: true, timeAgo: '2 hours ago', category: 'pending' },
      { id: 've2', title: 'Update product card component', description: 'Improve product card design with better image handling', hasNotification: true, timeAgo: '4 hours ago', category: 'pending' },
      { id: 've3', title: 'Implement dark mode toggle', description: 'Add dark/light theme switcher to header', hasNotification: false, timeAgo: '1 day ago', category: 'today' },
      { id: 've4', title: 'Optimize mobile navigation', description: 'Improve mobile menu UX and performance', hasNotification: false, timeAgo: '1 day ago', category: 'today' },
      { id: 've5', title: 'Design checkout flow', description: 'Create streamlined checkout process', hasNotification: false, timeAgo: '2 days ago', category: 'yesterday' },
      { id: 've6', title: 'Update brand colors', description: 'Apply new brand guidelines to all components', hasNotification: true, timeAgo: '3 days ago', category: 'yesterday' },
      { id: 've7', title: 'Create landing page templates', description: 'Build reusable landing page components', hasNotification: false, timeAgo: '4 days ago', category: 'yesterday' },
      { id: 've8', title: 'Implement search functionality', description: 'Add advanced search with filters', hasNotification: true, timeAgo: '5 days ago', category: 'yesterday' }
    ],
    'ad': [
      { id: 'ad1', title: 'Create Facebook ad campaign', description: 'Design and launch new Facebook advertising campaign', hasNotification: true, timeAgo: '1 hour ago', category: 'pending' },
      { id: 'ad2', title: 'Optimize Google Ads keywords', description: 'Research and update high-performing keywords', hasNotification: false, timeAgo: '3 hours ago', category: 'pending' },
      { id: 'ad3', title: 'Analyze ad performance metrics', description: 'Review CTR, conversion rates and ROI data', hasNotification: true, timeAgo: '6 hours ago', category: 'today' },
      { id: 'ad4', title: 'Create Instagram Stories ads', description: 'Design vertical ads for Instagram Stories', hasNotification: false, timeAgo: '1 day ago', category: 'today' },
      { id: 'ad5', title: 'Set up retargeting campaigns', description: 'Configure pixel-based retargeting for website visitors', hasNotification: false, timeAgo: '2 days ago', category: 'yesterday' },
      { id: 'ad6', title: 'A/B test ad creatives', description: 'Test different ad images and copy variations', hasNotification: true, timeAgo: '3 days ago', category: 'yesterday' }
    ],
    'ai1': [
      { id: 'ai1', title: 'Train customer service model', description: 'Improve AI responses for common customer queries', hasNotification: true, timeAgo: '30 minutes ago', category: 'pending' },
      { id: 'ai2', title: 'Implement chatbot integration', description: 'Connect AI assistant to website chat system', hasNotification: false, timeAgo: '2 hours ago', category: 'pending' },
      { id: 'ai3', title: 'Analyze conversation logs', description: 'Review AI interactions and identify improvement areas', hasNotification: true, timeAgo: '4 hours ago', category: 'today' },
      { id: 'ai4', title: 'Update knowledge base', description: 'Add new product information to AI training data', hasNotification: false, timeAgo: '1 day ago', category: 'today' },
      { id: 'ai5', title: 'Configure sentiment analysis', description: 'Set up emotion detection for customer messages', hasNotification: false, timeAgo: '2 days ago', category: 'yesterday' },
      { id: 'ai6', title: 'Test multilingual support', description: 'Validate AI responses in different languages', hasNotification: true, timeAgo: '3 days ago', category: 'yesterday' },
      { id: 'ai7', title: 'Optimize response time', description: 'Improve AI processing speed and accuracy', hasNotification: false, timeAgo: '4 days ago', category: 'yesterday' }
    ],
    'campaigns': [
      { id: 'cp1', title: 'Launch Black Friday campaign', description: 'Create and deploy Black Friday promotional campaign', hasNotification: true, timeAgo: '45 minutes ago', category: 'pending' },
      { id: 'cp2', title: 'Design email newsletter', description: 'Create weekly newsletter with product highlights', hasNotification: false, timeAgo: '2 hours ago', category: 'pending' },
      { id: 'cp3', title: 'Schedule social media posts', description: 'Plan and schedule posts for next week', hasNotification: true, timeAgo: '3 hours ago', category: 'today' },
      { id: 'cp4', title: 'Create promotional banners', description: 'Design banners for homepage and category pages', hasNotification: false, timeAgo: '1 day ago', category: 'today' },
      { id: 'cp5', title: 'Set up loyalty program', description: 'Configure points system and rewards', hasNotification: false, timeAgo: '2 days ago', category: 'yesterday' },
      { id: 'cp6', title: 'Analyze campaign performance', description: 'Review metrics and optimize underperforming campaigns', hasNotification: true, timeAgo: '3 days ago', category: 'yesterday' },
      { id: 'cp7', title: 'Create seasonal collection', description: 'Design and launch holiday-themed product collection', hasNotification: false, timeAgo: '4 days ago', category: 'yesterday' },
      { id: 'cp8', title: 'Plan influencer partnerships', description: 'Research and contact potential brand ambassadors', hasNotification: true, timeAgo: '5 days ago', category: 'yesterday' },
      { id: 'cp9', title: 'Update campaign calendar', description: 'Plan marketing activities for next quarter', hasNotification: false, timeAgo: '6 days ago', category: 'yesterday' }
    ],
    'customerservice': [
      { id: 'cs1', title: 'Resolve shipping complaint', description: 'Handle customer complaint about delayed delivery', hasNotification: true, timeAgo: '15 minutes ago', category: 'pending' },
      { id: 'cs2', title: 'Process return request', description: 'Process return for defective product', hasNotification: false, timeAgo: '1 hour ago', category: 'pending' },
      { id: 'cs3', title: 'Update FAQ section', description: 'Add new common questions to help center', hasNotification: true, timeAgo: '2 hours ago', category: 'today' },
      { id: 'cs4', title: 'Train new support agent', description: 'Onboard new customer service representative', hasNotification: false, timeAgo: '1 day ago', category: 'today' },
      { id: 'cs5', title: 'Review customer feedback', description: 'Analyze recent customer satisfaction surveys', hasNotification: false, timeAgo: '2 days ago', category: 'yesterday' },
      { id: 'cs6', title: 'Implement live chat', description: 'Set up real-time customer support chat', hasNotification: true, timeAgo: '3 days ago', category: 'yesterday' }
    ],
    'insights': [
      { id: 'in1', title: 'Generate sales report', description: 'Create monthly sales performance analysis', hasNotification: true, timeAgo: '20 minutes ago', category: 'pending' },
      { id: 'in2', title: 'Analyze user behavior', description: 'Study website analytics and user journey patterns', hasNotification: false, timeAgo: '1 hour ago', category: 'pending' },
      { id: 'in3', title: 'Create conversion funnel', description: 'Map customer journey from visit to purchase', hasNotification: true, timeAgo: '2 hours ago', category: 'today' },
      { id: 'in4', title: 'Monitor site performance', description: 'Track page load times and optimization opportunities', hasNotification: false, timeAgo: '1 day ago', category: 'today' },
      { id: 'in5', title: 'Segment customer data', description: 'Create customer personas based on purchase behavior', hasNotification: false, timeAgo: '2 days ago', category: 'yesterday' },
      { id: 'in6', title: 'Predict inventory needs', description: 'Use ML to forecast product demand', hasNotification: true, timeAgo: '3 days ago', category: 'yesterday' },
      { id: 'in7', title: 'A/B test results analysis', description: 'Evaluate results from recent website experiments', hasNotification: false, timeAgo: '4 days ago', category: 'yesterday' },
      { id: 'in8', title: 'Create executive dashboard', description: 'Build real-time KPI monitoring dashboard', hasNotification: true, timeAgo: '5 days ago', category: 'yesterday' }
    ],
    'search': [
      { id: 'se1', title: 'Optimize search algorithm', description: 'Improve product search relevance and speed', hasNotification: true, timeAgo: '25 minutes ago', category: 'pending' },
      { id: 'se2', title: 'Add search filters', description: 'Implement advanced filtering options', hasNotification: false, timeAgo: '1 hour ago', category: 'pending' },
      { id: 'se3', title: 'Index new products', description: 'Add recently launched products to search index', hasNotification: true, timeAgo: '2 hours ago', category: 'today' },
      { id: 'se4', title: 'Fix search suggestions', description: 'Improve autocomplete functionality', hasNotification: false, timeAgo: '1 day ago', category: 'today' },
      { id: 'se5', title: 'Analyze search queries', description: 'Review popular search terms and optimize results', hasNotification: false, timeAgo: '2 days ago', category: 'yesterday' },
      { id: 'se6', title: 'Implement voice search', description: 'Add voice-activated search functionality', hasNotification: true, timeAgo: '3 days ago', category: 'yesterday' }
    ]
  };

  return tasksByAgent[agentId || 'visualeditor'] || tasksByAgent['visualeditor'];
};

export const getAgentPinnedCards = (agentId: string | null): MockPinnedCard[] => {
  const cardsByAgent: Record<string, MockPinnedCard[]> = {
    'visualeditor': [
      { id: 've1', title: 'Homepage Redesign', description: 'Modern homepage with improved UX and mobile responsiveness', type: 'task', timeAgo: '2 weeks ago' },
      { id: 've2', title: 'Product Gallery Component', description: 'Interactive product showcase with zoom and filters', type: 'task', timeAgo: '1 month ago' },
      { id: 've3', title: 'Checkout Flow Optimization', description: 'Streamlined checkout process reducing cart abandonment', type: 'task', timeAgo: '3 weeks ago' },
      { id: 've4', title: 'Mobile Navigation Update', description: 'Improved mobile menu with better accessibility', type: 'task', timeAgo: '2 months ago' },
      { id: 've5', title: 'Dark Mode Implementation', description: 'Theme switcher with smooth transitions and user preferences', type: 'task', timeAgo: '1 week ago' },
      { id: 've6', title: 'Performance Optimization', description: 'Page load speed improvements and Core Web Vitals optimization', type: 'task', timeAgo: '5 days ago' },
      { id: 've7', title: 'Accessibility Compliance', description: 'WCAG 2.1 AA compliance implementation across all components', type: 'task', timeAgo: '3 days ago' },
      { id: 've8', title: 'Component Library Update', description: 'Design system components with new brand guidelines', type: 'task', timeAgo: '1 day ago' }
    ],
    'ad': [
      { id: 'ad1', title: 'Facebook Campaign Performance', description: 'Q4 Facebook advertising campaign results and optimization', type: 'task', timeAgo: '1 week ago' }
    ],
    'ai1': [
      { id: 'ai1', title: 'Customer Service Bot Training', description: 'AI model improvements for better customer query handling', type: 'task', timeAgo: '5 days ago' },
      { id: 'ai2', title: 'Chatbot Integration', description: 'Website chat system integration with AI assistant', type: 'task', timeAgo: '2 weeks ago' },
      { id: 'ai3', title: 'Multilingual Support', description: 'AI responses validation across different languages', type: 'task', timeAgo: '3 weeks ago' },
      { id: 'ai4', title: 'Sentiment Analysis Setup', description: 'Emotion detection implementation for customer messages', type: 'task', timeAgo: '1 month ago' },
      { id: 'ai5', title: 'Response Time Optimization', description: 'AI processing speed improvements and accuracy enhancements', type: 'task', timeAgo: '2 weeks ago' },
      { id: 'ai6', title: 'Knowledge Base Integration', description: 'Dynamic knowledge base updates for better AI responses', type: 'task', timeAgo: '1 week ago' },
      { id: 'ai7', title: 'Conversation Analytics', description: 'AI interaction analysis and improvement recommendations', type: 'task', timeAgo: '3 days ago' },
      { id: 'ai8', title: 'Voice Recognition Setup', description: 'Voice-to-text integration for customer support calls', type: 'task', timeAgo: '1 day ago' },
      { id: 'ai9', title: 'Intent Classification', description: 'Advanced intent detection for better query routing', type: 'task', timeAgo: '6 hours ago' },
      { id: 'ai10', title: 'Escalation Rules', description: 'Smart escalation system for complex customer issues', type: 'task', timeAgo: '2 hours ago' },
      { id: 'ai11', title: 'Training Data Validation', description: 'Quality assurance for AI training datasets', type: 'task', timeAgo: '30 minutes ago' }
    ],
    'campaigns': [
      { id: 'cp1', title: 'Black Friday Campaign Launch', description: 'Holiday promotional campaign with special offers and discounts', type: 'task', timeAgo: '3 days ago' },
      { id: 'cp2', title: 'Email Newsletter Design', description: 'Weekly newsletter template with product highlights and news', type: 'task', timeAgo: '1 week ago' },
      { id: 'cp3', title: 'Social Media Calendar', description: 'Content planning and scheduling for next month', type: 'task', timeAgo: '2 weeks ago' },
      { id: 'cp4', title: 'Loyalty Program Implementation', description: 'Points system and rewards configuration', type: 'task', timeAgo: '3 weeks ago' },
      { id: 'cp5', title: 'Influencer Partnership Research', description: 'Brand ambassador research and outreach strategy', type: 'task', timeAgo: '1 month ago' },
      { id: 'cp6', title: 'Seasonal Collection Launch', description: 'Holiday-themed product collection design and marketing', type: 'task', timeAgo: '2 weeks ago' },
      { id: 'cp7', title: 'Cross-Channel Integration', description: 'Unified messaging across email, social, and website', type: 'task', timeAgo: '1 week ago' },
      { id: 'cp8', title: 'Campaign Performance Analysis', description: 'ROI analysis and optimization recommendations', type: 'task', timeAgo: '5 days ago' },
      { id: 'cp9', title: 'A/B Testing Framework', description: 'Automated testing system for campaign variations', type: 'task', timeAgo: '3 days ago' },
      { id: 'cp10', title: 'Customer Segmentation', description: 'Advanced segmentation for targeted campaigns', type: 'task', timeAgo: '1 day ago' },
      { id: 'cp11', title: 'Retention Campaign Strategy', description: 'Customer retention focused marketing initiatives', type: 'task', timeAgo: '6 hours ago' }
    ],
    'customerservice': [
      { id: 'cs1', title: 'Shipping Issue Resolution', description: 'Customer complaint handling and delivery problem solving', type: 'task', timeAgo: '2 days ago' },
      { id: 'cs2', title: 'Return Process Optimization', description: 'Streamlined return and refund process implementation', type: 'task', timeAgo: '1 week ago' },
      { id: 'cs3', title: 'FAQ Section Update', description: 'Help center content updates with new common questions', type: 'task', timeAgo: '2 weeks ago' },
      { id: 'cs4', title: 'Live Chat Implementation', description: 'Real-time customer support chat system setup', type: 'task', timeAgo: '3 weeks ago' },
      { id: 'cs5', title: 'Support Ticket System', description: 'Advanced ticketing system with priority management', type: 'task', timeAgo: '1 month ago' },
      { id: 'cs6', title: 'Customer Satisfaction Survey', description: 'Post-interaction feedback collection and analysis', type: 'task', timeAgo: '2 weeks ago' },
      { id: 'cs7', title: 'Knowledge Base Migration', description: 'Legacy support content migration to new platform', type: 'task', timeAgo: '1 week ago' }
    ],
    'insights': [
      { id: 'in1', title: 'Monthly Sales Report', description: 'Comprehensive sales performance analysis and trends', type: 'task', timeAgo: '1 week ago' },
      { id: 'in2', title: 'User Behavior Analysis', description: 'Website analytics study and customer journey mapping', type: 'task', timeAgo: '2 weeks ago' },
      { id: 'in3', title: 'Conversion Funnel Creation', description: 'Customer journey optimization from visit to purchase', type: 'task', timeAgo: '3 weeks ago' },
      { id: 'in4', title: 'Executive Dashboard', description: 'Real-time KPI monitoring dashboard for management', type: 'task', timeAgo: '1 month ago' },
      { id: 'in5', title: 'Inventory Prediction Model', description: 'Machine learning model for product demand forecasting', type: 'task', timeAgo: '6 weeks ago' },
      { id: 'in6', title: 'Customer Lifetime Value', description: 'CLV analysis and segmentation for marketing strategy', type: 'task', timeAgo: '2 weeks ago' },
      { id: 'in7', title: 'Market Trend Analysis', description: 'Industry trends and competitive landscape assessment', type: 'task', timeAgo: '1 week ago' },
      { id: 'in8', title: 'Revenue Forecasting', description: 'Predictive analytics for revenue planning and budgeting', type: 'task', timeAgo: '5 days ago' },
      { id: 'in9', title: 'Cohort Analysis', description: 'Customer retention and engagement cohort studies', type: 'task', timeAgo: '3 days ago' },
      { id: 'in10', title: 'A/B Test Results', description: 'Statistical analysis of website optimization experiments', type: 'task', timeAgo: '1 day ago' },
      { id: 'in11', title: 'Performance Benchmarking', description: 'Industry benchmarking and competitive analysis', type: 'task', timeAgo: '6 hours ago' }
    ],
    'search': [
      { id: 'se1', title: 'Search Algorithm Optimization', description: 'Improved product search relevance and performance', type: 'task', timeAgo: '1 week ago' },
      { id: 'se2', title: 'Advanced Search Filters', description: 'Enhanced filtering options for better product discovery', type: 'task', timeAgo: '2 weeks ago' },
      { id: 'se3', title: 'Voice Search Implementation', description: 'Voice-activated search functionality for mobile users', type: 'task', timeAgo: '3 weeks ago' },
      { id: 'se4', title: 'Search Analytics Review', description: 'Popular search terms analysis and result optimization', type: 'task', timeAgo: '1 month ago' },
      { id: 'se5', title: 'Autocomplete Enhancement', description: 'Smart search suggestions with typo tolerance', type: 'task', timeAgo: '2 weeks ago' },
      { id: 'se6', title: 'Search Result Ranking', description: 'Machine learning based search result optimization', type: 'task', timeAgo: '1 week ago' },
      { id: 'se7', title: 'Faceted Search Implementation', description: 'Multi-dimensional filtering for complex product catalogs', type: 'task', timeAgo: '5 days ago' },
      { id: 'se8', title: 'Search Performance Monitoring', description: 'Real-time search analytics and performance tracking', type: 'task', timeAgo: '2 days ago' }
    ],
    'fullfilment': [
      { id: 'ff1', title: 'Warehouse Optimization', description: 'Inventory management system improvements and automation', type: 'task', timeAgo: '1 week ago' },
      { id: 'ff2', title: 'Shipping Cost Analysis', description: 'Carrier comparison and cost optimization strategies', type: 'task', timeAgo: '2 weeks ago' },
      { id: 'ff3', title: 'Order Processing Automation', description: 'Automated order fulfillment workflow implementation', type: 'task', timeAgo: '3 weeks ago' },
      { id: 'ff4', title: 'Inventory Forecasting', description: 'Demand prediction model for optimal stock levels', type: 'task', timeAgo: '1 month ago' },
      { id: 'ff5', title: 'Returns Processing', description: 'Streamlined returns handling and restocking procedures', type: 'task', timeAgo: '2 weeks ago' },
      { id: 'ff6', title: 'Quality Control System', description: 'Automated quality checks and defect detection', type: 'task', timeAgo: '1 week ago' },
      { id: 'ff7', title: 'Supplier Integration', description: 'API integration with key suppliers for real-time inventory', type: 'task', timeAgo: '5 days ago' },
      { id: 'ff8', title: 'Packaging Optimization', description: 'Sustainable packaging solutions and cost reduction', type: 'task', timeAgo: '3 days ago' },
      { id: 'ff9', title: 'Delivery Route Optimization', description: 'AI-powered route planning for faster deliveries', type: 'task', timeAgo: '1 day ago' },
      { id: 'ff10', title: 'Fulfillment Analytics', description: 'Performance metrics and KPI tracking dashboard', type: 'task', timeAgo: '6 hours ago' },
      { id: 'ff11', title: 'Multi-Channel Inventory', description: 'Unified inventory management across all sales channels', type: 'task', timeAgo: '2 hours ago' }
    ],
    'handling': [
      { id: 'hd1', title: 'Order Management System', description: 'Centralized order processing and status tracking', type: 'task', timeAgo: '1 week ago' },
      { id: 'hd2', title: 'Customer Communication', description: 'Automated order updates and delivery notifications', type: 'task', timeAgo: '2 weeks ago' },
      { id: 'hd3', title: 'Exception Handling', description: 'Automated handling of order exceptions and delays', type: 'task', timeAgo: '3 weeks ago' },
      { id: 'hd4', title: 'Payment Processing', description: 'Secure payment gateway integration and fraud detection', type: 'task', timeAgo: '1 month ago' },
      { id: 'hd5', title: 'Order Validation', description: 'Automated order validation and error prevention', type: 'task', timeAgo: '2 weeks ago' },
      { id: 'hd6', title: 'Inventory Allocation', description: 'Smart inventory allocation across multiple warehouses', type: 'task', timeAgo: '1 week ago' },
      { id: 'hd7', title: 'Backorder Management', description: 'Automated backorder handling and customer notifications', type: 'task', timeAgo: '5 days ago' },
      { id: 'hd8', title: 'Order Splitting', description: 'Intelligent order splitting for optimal fulfillment', type: 'task', timeAgo: '3 days ago' },
      { id: 'hd9', title: 'Customer Preferences', description: 'Personalized order handling based on customer history', type: 'task', timeAgo: '1 day ago' },
      { id: 'hd10', title: 'Performance Monitoring', description: 'Real-time order processing metrics and alerts', type: 'task', timeAgo: '6 hours ago' },
      { id: 'hd11', title: 'Integration Testing', description: 'End-to-end order processing system testing', type: 'task', timeAgo: '2 hours ago' }
    ],
    'offers': [
      { id: 'of1', title: 'Dynamic Pricing Engine', description: 'AI-powered pricing optimization based on demand and competition', type: 'task', timeAgo: '1 week ago' },
      { id: 'of2', title: 'Promotional Campaign Setup', description: 'Automated promotional campaign creation and management', type: 'task', timeAgo: '2 weeks ago' },
      { id: 'of3', title: 'Discount Management', description: 'Centralized discount code generation and validation', type: 'task', timeAgo: '3 weeks ago' },
      { id: 'of4', title: 'Bulk Pricing Rules', description: 'Volume-based pricing tiers and quantity discounts', type: 'task', timeAgo: '1 month ago' },
      { id: 'of5', title: 'Seasonal Pricing', description: 'Time-based pricing adjustments for seasonal products', type: 'task', timeAgo: '2 weeks ago' },
      { id: 'of6', title: 'Competitor Price Monitoring', description: 'Automated competitor price tracking and alerts', type: 'task', timeAgo: '1 week ago' },
      { id: 'of7', title: 'Customer-Specific Offers', description: 'Personalized offers based on customer behavior and history', type: 'task', timeAgo: '5 days ago' },
      { id: 'of8', title: 'A/B Testing Framework', description: 'Automated testing of different pricing strategies', type: 'task', timeAgo: '3 days ago' },
      { id: 'of9', title: 'Revenue Impact Analysis', description: 'ROI analysis of pricing changes and promotional campaigns', type: 'task', timeAgo: '1 day ago' },
      { id: 'of10', title: 'Price Elasticity Modeling', description: 'Statistical models for price sensitivity analysis', type: 'task', timeAgo: '6 hours ago' },
      { id: 'of11', title: 'Cross-Selling Optimization', description: 'Intelligent product bundling and cross-selling offers', type: 'task', timeAgo: '2 hours ago' }
    ],
    'productrec': [
      { id: 'pr1', title: 'Recommendation Engine', description: 'AI-powered product recommendation system', type: 'task', timeAgo: '1 week ago' },
      { id: 'pr2', title: 'Collaborative Filtering', description: 'User-based collaborative filtering algorithm implementation', type: 'task', timeAgo: '2 weeks ago' },
      { id: 'pr3', title: 'Content-Based Filtering', description: 'Product feature-based recommendation system', type: 'task', timeAgo: '3 weeks ago' },
      { id: 'pr4', title: 'Hybrid Recommendation', description: 'Combined collaborative and content-based filtering', type: 'task', timeAgo: '1 month ago' },
      { id: 'pr5', title: 'Real-Time Recommendations', description: 'Dynamic recommendation updates based on user behavior', type: 'task', timeAgo: '2 weeks ago' },
      { id: 'pr6', title: 'A/B Testing Framework', description: 'Automated testing of different recommendation algorithms', type: 'task', timeAgo: '1 week ago' },
      { id: 'pr7', title: 'Cold Start Problem', description: 'Solutions for new users and new products recommendations', type: 'task', timeAgo: '5 days ago' },
      { id: 'pr8', title: 'Recommendation Diversity', description: 'Balancing relevance with recommendation diversity', type: 'task', timeAgo: '3 days ago' },
      { id: 'pr9', title: 'Performance Monitoring', description: 'Real-time recommendation performance tracking', type: 'task', timeAgo: '1 day ago' },
      { id: 'pr10', title: 'User Feedback Integration', description: 'Incorporating user feedback into recommendation models', type: 'task', timeAgo: '6 hours ago' },
      { id: 'pr11', title: 'Cross-Domain Recommendations', description: 'Recommendations across different product categories', type: 'task', timeAgo: '2 hours ago' }
    ],
    'salesassistant': [
      { id: 'sa1', title: 'Lead Qualification', description: 'Automated lead scoring and qualification system', type: 'task', timeAgo: '1 week ago' },
      { id: 'sa2', title: 'Sales Pipeline Management', description: 'CRM integration and pipeline optimization', type: 'task', timeAgo: '2 weeks ago' },
      { id: 'sa3', title: 'Follow-up Automation', description: 'Automated follow-up sequences for prospects', type: 'task', timeAgo: '3 weeks ago' },
      { id: 'sa4', title: 'Proposal Generation', description: 'Automated proposal creation and customization', type: 'task', timeAgo: '1 month ago' },
      { id: 'sa5', title: 'Contract Management', description: 'Digital contract creation and e-signature integration', type: 'task', timeAgo: '2 weeks ago' },
      { id: 'sa6', title: 'Sales Analytics', description: 'Performance tracking and sales forecasting', type: 'task', timeAgo: '1 week ago' },
      { id: 'sa7', title: 'Customer Onboarding', description: 'Automated customer onboarding workflow', type: 'task', timeAgo: '5 days ago' },
      { id: 'sa8', title: 'Upselling Opportunities', description: 'AI-powered upselling and cross-selling identification', type: 'task', timeAgo: '3 days ago' },
      { id: 'sa9', title: 'Sales Training', description: 'Interactive sales training modules and assessments', type: 'task', timeAgo: '1 day ago' },
      { id: 'sa10', title: 'Competitive Analysis', description: 'Automated competitive intelligence gathering', type: 'task', timeAgo: '6 hours ago' },
      { id: 'sa11', title: 'Sales Forecasting', description: 'Predictive analytics for sales planning and budgeting', type: 'task', timeAgo: '2 hours ago' }
    ],
    'thirdparty': [
      { id: 'tp1', title: 'API Integration', description: 'Third-party service integration and API management', type: 'task', timeAgo: '1 week ago' },
      { id: 'tp2', title: 'Data Synchronization', description: 'Real-time data sync with external systems', type: 'task', timeAgo: '2 weeks ago' },
      { id: 'tp3', title: 'Security Compliance', description: 'Security standards compliance for third-party integrations', type: 'task', timeAgo: '3 weeks ago' },
      { id: 'tp4', title: 'Error Handling', description: 'Robust error handling and retry mechanisms', type: 'task', timeAgo: '1 month ago' },
      { id: 'tp5', title: 'Performance Monitoring', description: 'Third-party service performance tracking', type: 'task', timeAgo: '2 weeks ago' },
      { id: 'tp6', title: 'Data Validation', description: 'Input validation and data quality checks', type: 'task', timeAgo: '1 week ago' },
      { id: 'tp7', title: 'Rate Limiting', description: 'API rate limiting and throttling implementation', type: 'task', timeAgo: '5 days ago' },
      { id: 'tp8', title: 'Fallback Mechanisms', description: 'Graceful degradation when third-party services fail', type: 'task', timeAgo: '3 days ago' },
      { id: 'tp9', title: 'Documentation', description: 'Comprehensive API documentation and integration guides', type: 'task', timeAgo: '1 day ago' },
      { id: 'tp10', title: 'Testing Framework', description: 'Automated testing for third-party integrations', type: 'task', timeAgo: '6 hours ago' },
      { id: 'tp11', title: 'Monitoring Dashboard', description: 'Real-time monitoring dashboard for all integrations', type: 'task', timeAgo: '2 hours ago' }
    ],
    'vtexhelp': [
      { id: 'vh1', title: 'VTEX Platform Support', description: 'Technical support for VTEX platform issues', type: 'task', timeAgo: '1 week ago' },
      { id: 'vh2', title: 'Integration Assistance', description: 'Help with VTEX API integrations and customizations', type: 'task', timeAgo: '2 weeks ago' },
      { id: 'vh3', title: 'Performance Optimization', description: 'VTEX store performance optimization and monitoring', type: 'task', timeAgo: '3 weeks ago' },
      { id: 'vh4', title: 'Migration Support', description: 'Assistance with VTEX platform migrations and updates', type: 'task', timeAgo: '1 month ago' },
      { id: 'vh5', title: 'Custom Development', description: 'Custom VTEX development and module creation', type: 'task', timeAgo: '2 weeks ago' },
      { id: 'vh6', title: 'Training Sessions', description: 'VTEX platform training and best practices', type: 'task', timeAgo: '1 week ago' },
      { id: 'vh7', title: 'Troubleshooting', description: 'Advanced troubleshooting for complex VTEX issues', type: 'task', timeAgo: '5 days ago' },
      { id: 'vh8', title: 'Security Audit', description: 'VTEX security audit and compliance review', type: 'task', timeAgo: '3 days ago' },
      { id: 'vh9', title: 'Backup Strategy', description: 'VTEX data backup and disaster recovery planning', type: 'task', timeAgo: '1 day ago' },
      { id: 'vh10', title: 'Monitoring Setup', description: 'Comprehensive monitoring setup for VTEX applications', type: 'task', timeAgo: '6 hours ago' },
      { id: 'vh11', title: 'Documentation Review', description: 'VTEX documentation review and updates', type: 'task', timeAgo: '2 hours ago' }
    ],
    'projects': [
      { id: 'pj1', title: 'Project Planning', description: 'Comprehensive project planning and resource allocation', type: 'task', timeAgo: '1 week ago' },
      { id: 'pj2', title: 'Timeline Management', description: 'Project timeline tracking and milestone management', type: 'task', timeAgo: '2 weeks ago' },
      { id: 'pj3', title: 'Resource Allocation', description: 'Team resource allocation and workload balancing', type: 'task', timeAgo: '3 weeks ago' },
      { id: 'pj4', title: 'Risk Assessment', description: 'Project risk identification and mitigation strategies', type: 'task', timeAgo: '1 month ago' },
      { id: 'pj5', title: 'Quality Assurance', description: 'Project quality standards and testing procedures', type: 'task', timeAgo: '2 weeks ago' },
      { id: 'pj6', title: 'Stakeholder Communication', description: 'Regular stakeholder updates and communication', type: 'task', timeAgo: '1 week ago' },
      { id: 'pj7', title: 'Budget Management', description: 'Project budget tracking and cost optimization', type: 'task', timeAgo: '5 days ago' },
      { id: 'pj8', title: 'Documentation', description: 'Project documentation and knowledge management', type: 'task', timeAgo: '3 days ago' },
      { id: 'pj9', title: 'Team Collaboration', description: 'Team collaboration tools and workflow optimization', type: 'task', timeAgo: '1 day ago' },
      { id: 'pj10', title: 'Performance Metrics', description: 'Project performance tracking and KPI monitoring', type: 'task', timeAgo: '6 hours ago' },
      { id: 'pj11', title: 'Lessons Learned', description: 'Post-project analysis and lessons learned documentation', type: 'task', timeAgo: '2 hours ago' }
    ]
  };

  return cardsByAgent[agentId || 'visualeditor'] || cardsByAgent['visualeditor'];
};
