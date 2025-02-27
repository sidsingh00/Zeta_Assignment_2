import { DocumentationItem } from '../types';

// This file contains mock documentation data for the CDP platforms
// In a real application, this would be populated by scraping the documentation sites

export const documentationData: DocumentationItem[] = [
  // Segment documentation
  {
    id: 'segment-1',
    title: 'Setting up a new source in Segment',
    content: `
# Setting up a new source in Segment

To set up a new source in Segment, follow these steps:

1. Log in to your Segment workspace
2. Navigate to Sources in the left sidebar
3. Click "Add Source" button
4. Search for the type of source you want to add
5. Select the source and click "Add Source"
6. Configure the source settings according to your requirements
7. Save your configuration

For website sources, you'll need to install the Segment snippet on your website. For server-side sources, you'll need to install the appropriate library for your programming language.

## Installing the JavaScript snippet

For websites, add the following code to your site:

\`\`\`javascript
<script>
  !function(){var analytics=window.analytics=window.analytics||[];if(!analytics.initialize)if(analytics.invoked)window.console&&console.error&&console.error("Segment snippet included twice.");else{analytics.invoked=!0;analytics.methods=["trackSubmit","trackClick","trackLink","trackForm","pageview","identify","reset","group","track","ready","alias","debug","page","once","off","on","addSourceMiddleware","addIntegrationMiddleware","setAnonymousId","addDestinationMiddleware"];analytics.factory=function(e){return function(){var t=Array.prototype.slice.call(arguments);t.unshift(e);analytics.push(t);return analytics}};for(var e=0;e<analytics.methods.length;e++){var key=analytics.methods[e];analytics[key]=analytics.factory(key)}analytics.load=function(key,e){var t=document.createElement("script");t.type="text/javascript";t.async=!0;t.src="https://cdn.segment.com/analytics.js/v1/" + key + "/analytics.min.js";var n=document.getElementsByTagName("script")[0];n.parentNode.insertBefore(t,n);analytics._loadOptions=e};analytics._writeKey="YOUR_WRITE_KEY";analytics.SNIPPET_VERSION="4.13.2";
  analytics.load("YOUR_WRITE_KEY");
  analytics.page();
  }}();
</script>
\`\`\`

Replace "YOUR_WRITE_KEY" with the write key from your Segment source settings.
    `,
    url: 'https://segment.com/docs/connections/sources/',
    platform: 'segment'
  },
  {
    id: 'segment-2',
    title: 'Tracking events in Segment',
    content: `
# Tracking events in Segment

Segment allows you to track user interactions with your product. Here's how to implement event tracking:

## Track method

The \`track()\` method is how you record any actions your users perform, along with any properties that describe the action.

\`\`\`javascript
analytics.track('Button Clicked', {
  buttonColor: 'red',
  buttonPosition: 'top'
});
\`\`\`

## Identify method

The \`identify()\` method is how you associate a user with their actions and record traits about them.

\`\`\`javascript
analytics.identify('user123', {
  name: 'John Doe',
  email: 'john.doe@example.com',
  plan: 'premium'
});
\`\`\`

## Page method

The \`page()\` method lets you record page views on your website, along with optional information about the page.

\`\`\`javascript
analytics.page('Home', {
  path: '/',
  referrer: 'https://google.com'
});
\`\`\`

## Group method

The \`group()\` method lets you associate a user with a group (like a company, organization, account, etc.).

\`\`\`javascript
analytics.group('group123', {
  name: 'Acme Inc.',
  industry: 'Technology',
  employees: 100
});
\`\`\`
    `,
    url: 'https://segment.com/docs/connections/spec/track/',
    platform: 'segment'
  },
  {
    id: 'segment-3',
    title: 'Creating a destination in Segment',
    content: `
# Creating a destination in Segment

Destinations in Segment allow you to send your data to various tools and platforms. Here's how to set up a destination:

1. Log in to your Segment workspace
2. Navigate to Destinations in the left sidebar
3. Click "Add Destination" button
4. Search for the destination you want to add
5. Select the destination and click "Configure"
6. Choose which source(s) should send data to this destination
7. Configure the destination settings according to your requirements
8. Enable the destination when you're ready

## Common destination settings

Most destinations require some form of authentication, such as:

- API keys
- OAuth credentials
- Account IDs
- Tracking IDs

Some destinations also allow you to:

- Filter which events are sent
- Map your event names to the destination's expected format
- Transform properties before they're sent
- Set up custom mappings for user traits

## Testing destinations

After setting up a destination, you can test it by:

1. Going to the Debugger in your Segment workspace
2. Sending test events to your source
3. Verifying that the events appear in the destination
    `,
    url: 'https://segment.com/docs/connections/destinations/',
    platform: 'segment'
  },
  
  // mParticle documentation
  {
    id: 'mparticle-1',
    title: 'Creating a user profile in mParticle',
    content: `
# Creating a user profile in mParticle

mParticle uses identity to create user profiles. Here's how to set up and manage user profiles:

## Identity API

The Identity API is the foundation of mParticle's user profile system. It allows you to:

1. Create new user profiles
2. Merge existing profiles
3. Manage identity state across devices and platforms

## Setting up a user profile

To create a user profile, you need to identify the user with one or more identity types:

\`\`\`javascript
const identityRequest = {
  userIdentities: {
    email: 'user@example.com',
    customerId: '123456',
    // Other identity types as needed
  }
};

mParticle.Identity.login(identityRequest);
\`\`\`

## Identity types

mParticle supports several identity types:

- Customer ID
- Email
- Facebook ID
- Google ID
- Microsoft ID
- Phone number
- Other (custom identifiers)

## Modifying user profiles

You can update user attributes to enrich the profile:

\`\`\`javascript
mParticle.Identity.getCurrentUser().setUserAttribute('firstName', 'John');
mParticle.Identity.getCurrentUser().setUserAttribute('lastName', 'Doe');
mParticle.Identity.getCurrentUser().setUserAttribute('premiumUser', true);
mParticle.Identity.getCurrentUser().setUserAttribute('lastPurchaseDate', '2023-04-15');
\`\`\`

## User profile best practices

1. Use a consistent customer ID across channels
2. Collect relevant user attributes that will be useful for segmentation
3. Keep user profiles updated as information changes
4. Be mindful of privacy regulations when collecting user data
    `,
    url: 'https://docs.mparticle.com/guides/idsync/introduction/',
    platform: 'mparticle'
  },
  {
    id: 'mparticle-2',
    title: 'Tracking events in mParticle',
    content: `
# Tracking events in mParticle

mParticle allows you to track various types of events to understand user behavior. Here's how to implement event tracking:

## Event types

mParticle supports several event types:

1. **App Events** - General purpose events
2. **Commerce Events** - Purchase and shopping-related events
3. **Screen Views** - Page or screen navigation
4. **User Attribute Changes** - Updates to user profile data
5. **User Identity Changes** - Updates to user identity information

## Tracking app events

\`\`\`javascript
const eventAttributes = {
  buttonColor: 'red',
  buttonPosition: 'top'
};

mParticle.logEvent(
  'Button Clicked',
  mParticle.EventType.Other,
  eventAttributes
);
\`\`\`

## Tracking commerce events

\`\`\`javascript
// Create a product
const product = mParticle.eCommerce.createProduct(
  'Product Name',
  'SKU-123',
  19.99,
  2 // Quantity
);

// Create a transaction attributes object
const transactionAttributes = {
  Id: 'order-123',
  Revenue: 39.98,
  Tax: 3.20
};

// Log a purchase event
mParticle.eCommerce.logPurchase(
  transactionAttributes,
  [product]
);
\`\`\`

## Tracking screen views

\`\`\`javascript
mParticle.logPageView(
  'Home Screen',
  {
    path: '/',
    referrer: 'https://google.com'
  }
);
\`\`\`

## Custom event attributes

You can add custom attributes to any event to provide additional context:

\`\`\`javascript
const eventAttributes = {
  category: 'sports',
  value: 29.99,
  isPromotion: true,
  tags: ['summer', 'sale']
};

mParticle.logEvent(
  'Product Viewed',
  mParticle.EventType.Other,
  eventAttributes
);
\`\`\`
    `,
    url: 'https://docs.mparticle.com/developers/sdk/web/event-tracking/',
    platform: 'mparticle'
  },
  {
    id: 'mparticle-3',
    title: 'Setting up an output in mParticle',
    content: `
# Setting up an output in mParticle

Outputs in mParticle allow you to send your data to various destinations. Here's how to set up an output:

## Adding a new output

1. Log in to your mParticle dashboard
2. Navigate to Setup > Outputs
3. Click "Add Output" button
4. Search for and select the desired output
5. Configure the output settings

## Configuration options

Most outputs require some form of authentication, such as:

- API keys
- Client IDs and secrets
- Account IDs
- Tracking IDs

## Connection settings

For each output, you can configure:

1. **Event filtering** - Choose which events to forward
2. **User filtering** - Choose which users to include
3. **Data mapping** - Map your event attributes to the output's expected format
4. **Batching and frequency** - Control how often data is sent

## Testing outputs

After setting up an output, you can test it by:

1. Using the Live Stream feature in the mParticle dashboard
2. Sending test events through your implementation
3. Verifying that the events appear in the destination platform

## Managing outputs

You can manage existing outputs by:

- Pausing/resuming data flow
- Updating configuration settings
- Viewing performance metrics
- Troubleshooting connection issues

## Best practices

1. Start with a limited set of events to ensure proper configuration
2. Use consistent naming conventions for events and attributes
3. Document your output configurations for team reference
4. Regularly review output performance and data quality
    `,
    url: 'https://docs.mparticle.com/guides/platform-guide/outputs/',
    platform: 'mparticle'
  },
  
  // Lytics documentation
  {
    id: 'lytics-1',
    title: 'Building an audience segment in Lytics',
    content: `
# Building an audience segment in Lytics

Audience segments in Lytics allow you to group users based on behaviors, attributes, and other criteria. Here's how to build an audience segment:

## Creating a new segment

1. Log in to your Lytics account
2. Navigate to Audiences > Segments
3. Click "Create Segment" button
4. Choose a segment type (behavioral, attribute-based, etc.)
5. Define your segment criteria
6. Save and activate your segment

## Segment types

Lytics offers several types of segments:

1. **Behavioral segments** - Based on user actions and events
2. **Attribute segments** - Based on user profile attributes
3. **Predictive segments** - Using machine learning to identify patterns
4. **Lookalike segments** - Finding users similar to a defined group

## Building segment criteria

You can use the segment builder to create complex criteria:

\`\`\`
IF user.hasVisitedPage('/pricing') AND
   user.industry = 'Technology' AND
   user.lastVisit > '30 days ago'
THEN include in segment
\`\`\`

## Using behavioral scoring

Lytics allows you to create behavioral scores that can be used in segments:

1. Create a behavioral score based on specific actions
2. Assign point values to different behaviors
3. Use the score as a criterion in your segment

Example:
\`\`\`
IF user.engagementScore > 50 AND
   user.hasCompletedPurchase = true
THEN include in segment
\`\`\`

## Testing segments

Before activating a segment, you can:

1. Preview the audience size
2. View sample users who match the criteria
3. Test different criteria combinations to refine your segment

## Activating segments

Once your segment is defined, you can:

1. Activate it for use in campaigns
2. Export it to marketing platforms
3. Use it for personalization
4. Track its growth or decline over time
    `,
    url: 'https://docs.lytics.com/product/segments/',
    platform: 'lytics'
  },
  {
    id: 'lytics-2',
    title: 'Collecting data in Lytics',
    content: `
# Collecting data in Lytics

Lytics provides multiple ways to collect user data from your digital properties. Here's how to implement data collection:

## JavaScript tag

The most common way to collect data is using the Lytics JavaScript tag:

\`\`\`html
<script>
  !function(l,y,t,i,c,s){
    l.LyticsId = c;
    s = y.createElement(t);
    s.src = "//c.lytics.io/static/io.min.js";
    s.async = true;
    y.head.appendChild(s);
  }(window, document, "script", 0, "YOUR_ACCOUNT_ID");
</script>
\`\`\`

Replace "YOUR_ACCOUNT_ID" with your Lytics account ID.

## Tracking events

To track user events with the JavaScript tag:

\`\`\`javascript
jstag.send({
  event: 'button_click',
  properties: {
    buttonName: 'signup',
    location: 'header'
  }
});
\`\`\`

## Identifying users

To associate events with a specific user:

\`\`\`javascript
jstag.identify({
  email: 'user@example.com',
  name: 'John Doe',
  subscription: 'premium'
});
\`\`\`

## Server-side collection

For server-side data collection, Lytics provides APIs and SDKs for various languages:

### Python example:
\`\`\`python
import lytics

client = lytics.LyticsClient('YOUR_API_KEY')
client.track(
  event='purchase',
  user_id='user123',
  properties={
    'product': 'Premium Plan',
    'price': 99.99,
    'currency': 'USD'
  }
)
\`\`\`

## Data integrations

Lytics can also collect data from various platforms through pre-built integrations:

1. CRM systems (Salesforce, HubSpot)
2. Marketing platforms (Google Analytics, Adobe)
3. E-commerce platforms (Shopify, Magento)
4. Customer support tools (Zendesk, Intercom)

To set up an integration:
1. Navigate to Integrations in your Lytics account
2. Select the desired platform
3. Follow the configuration steps for that integration
    `,
    url: 'https://docs.lytics.com/product/collect/',
    platform: 'lytics'
  },
  {
    id: 'lytics-3',
    title: 'Creating campaigns in Lytics',
    content: `
# Creating campaigns in Lytics

Lytics campaigns allow you to deliver personalized experiences to your audience segments. Here's how to create and manage campaigns:

## Creating a new campaign

1. Log in to your Lytics account
2. Navigate to Campaigns
3. Click "Create Campaign" button
4. Select a campaign type
5. Configure the campaign settings
6. Choose target audience segments
7. Set up content and messaging
8. Activate the campaign

## Campaign types

Lytics supports several campaign types:

1. **Web personalization** - Customize website content
2. **Email campaigns** - Trigger personalized emails
3. **Ad targeting** - Optimize advertising spend
4. **SMS/Mobile** - Send targeted mobile messages
5. **Custom API** - Build custom experiences

## Web personalization example

To create a web personalization campaign:

1. Select "Web Personalization" as the campaign type
2. Choose which pages to personalize
3. Select target audience segments
4. Define the content variations
5. Set up A/B testing if desired
6. Configure display rules and frequency
7. Activate the campaign

## Campaign targeting

You can target campaigns based on:

- Audience segments
- User attributes
- Behavioral patterns
- Predictive scores
- Geographic location
- Device type
- Time of day

## Measuring campaign performance

Lytics provides analytics to measure campaign effectiveness:

1. Impression tracking
2. Click-through rates
3. Conversion attribution
4. Revenue impact
5. Segment growth

## A/B testing

To optimize campaigns, you can set up A/B tests:

1. Create multiple content variations
2. Define success metrics
3. Set test duration and sample size
4. Analyze results to determine the winning variation
5. Automatically or manually select the winner

## Best practices

1. Start with clearly defined goals for each campaign
2. Use specific, well-defined audience segments
3. Create personalized content that addresses segment needs
4. Test and iterate to improve performance
5. Document campaign strategies and results
    `,
    url: 'https://docs.lytics.com/product/campaigns/',
    platform: 'lytics'
  },
  
  // Zeotap documentation
  {
    id: 'zeotap-1',
    title: 'Integrating data with Zeotap',
    content: `
# Integrating data with Zeotap

Zeotap allows you to integrate data from various sources to build a unified customer view. Here's how to integrate your data:

## Data onboarding process

1. Log in to your Zeotap account
2. Navigate to Data Sources
3. Click "Add Data Source" button
4. Select the type of data source
5. Configure the connection settings
6. Map data fields to Zeotap's schema
7. Set up the data sync schedule
8. Activate the integration

## Supported data sources

Zeotap supports various data source types:

1. **CRM systems** (Salesforce, Microsoft Dynamics)
2. **Marketing platforms** (Google Analytics, Adobe)
3. **E-commerce platforms** (Shopify, Magento)
4. **File uploads** (CSV, JSON)
5. **Custom API integrations**

## File upload integration

To integrate data via file upload:

1. Prepare your data file in CSV or JSON format
2. Ensure it includes a unique identifier for each user
3. In Zeotap, select "File Upload" as the data source
4. Upload your file
5. Map the columns to Zeotap's data schema
6. Set the update frequency (one-time or recurring)
7. Submit the integration

## API integration

For real-time data integration, use Zeotap's API:

\`\`\`javascript
// Example API call to send user data
fetch('https://api.zeotap.com/v2/users', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_API_KEY'
  },
  body: JSON.stringify({
    userId: 'user123',
    attributes: {
      email: 'user@example.com',
      name: 'John Doe',
      subscription: 'premium',
      lastPurchase: '2023-04-15'
    },
    events: [
      {
        name: 'purchase',
        timestamp: '2023-04-15T14:30:00Z',
        properties: {
          productId: 'prod123',
          price: 99.99
        }
      }
    ]
  })
});
\`\`\`

## Data mapping

When integrating data, you'll need to map your data fields to Zeotap's schema:

1. Identify the key user identifiers (email, phone, customer ID)
2. Map user attributes to Zeotap's standard or custom attributes
3. Map events and behaviors to Zeotap's event schema
4. Set up transformations if needed

## Testing your integration

After setting up an integration, you should:

1. Send a small batch of test data
2. Verify that the data appears correctly in Zeotap
3. Check for any mapping or transformation issues
4. Validate that identities are being correctly matched
    `,
    url: 'https://docs.zeotap.com/home/en-us/integrations/',
    platform: 'zeotap'
  },
  {
    id: 'zeotap-2',
    title: 'Creating segments in Zeotap',
    content: `
# Creating segments in Zeotap

Zeotap's segmentation capabilities allow you to group users based on attributes and behaviors. Here's how to create segments:

## Creating a new segment

1. Log in to your Zeotap account
2. Navigate to Audience > Segments
3. Click "Create Segment" button
4. Define your segment criteria
5. Name and describe your segment
6. Save and activate the segment

## Segment builder

The segment builder allows you to create complex audience definitions:

1. Start by selecting the base population (all users or a subset)
2. Add filter conditions based on user attributes
3. Add behavioral conditions based on user actions
4. Combine conditions using AND/OR logic
5. Preview the estimated audience size

## Attribute-based segmentation

Example of attribute-based criteria:

\`\`\`
IF user.age > 25 AND
   user.age < 45 AND
   user.location = 'New York' AND
   user.income > 75000
THEN include in segment
\`\`\`

## Behavioral segmentation

Example of behavior-based criteria:

\`\`\`
IF user.hasPerformedEvent('purchase') AND
   user.eventProperty('purchase', 'value') > 100 AND
   user.eventCount('product_view') > 5 AND
   user.lastEventDate('site_visit') < '30 days ago'
THEN include in segment
\`\`\`

## Lookalike modeling

To create a lookalike segment:

1. Select a source segment (your best customers)
2. Choose the lookalike modeling method
3. Set the expansion factor (how similar the lookalike should be)
4. Generate the lookalike segment
5. Review and activate

## Segment activation

Once your segment is created, you can activate it across various channels:

1. **Advertising platforms** - For targeted ad campaigns
2. **Marketing tools** - For email or SMS campaigns
3. **On-site personalization** - For website customization
4. **Analytics tools** - For deeper audience analysis

## Segment analytics

Zeotap provides analytics for your segments:

1. Size and growth trends
2. Overlap with other segments
3. Attribute distribution
4. Behavioral patterns
5. Conversion metrics

## Best practices

1. Create clear, specific segment definitions
2. Use meaningful naming conventions
3. Document the purpose of each segment
4. Regularly review and update segments
5. Test segment performance across different channels
    `,
    url: 'https://docs.zeotap.com/home/en-us/audiences/',
    platform: 'zeotap'
  },
  {
    id: 'zeotap-3',
    title: 'Using Zeotap for identity resolution',
    content: `
# Using Zeotap for identity resolution

Zeotap's identity resolution capabilities help you create a unified view of your customers across devices and channels. Here's how to use this feature:

## Identity resolution overview

Identity resolution in Zeotap:

1. Connects user identifiers across channels and devices
2. Creates a unified user profile
3. Enables consistent targeting and personalization
4. Improves measurement and attribution

## Setting up identity resolution

1. Log in to your Zeotap account
2. Navigate to Identity settings
3. Configure your identity resolution rules
4. Select which identifiers to use for matching
5. Set confidence thresholds for matches
6. Activate identity resolution

## Supported identifiers

Zeotap can use various identifiers for matching:

1. **Deterministic identifiers**:
   - Email address
   - Phone number
   - Customer ID
   - Login credentials

2. **Probabilistic identifiers**:
   - Device IDs
   - IP addresses
   - Browser fingerprints
   - Behavioral patterns

## Identity graph

The identity graph visualizes connections between identifiers:

1. View how different identifiers are connected
2. See the confidence level of each connection
3. Understand the source of each identifier
4. Track how the graph evolves over time

## Cross-device tracking

To enable cross-device tracking:

1. Implement Zeotap's tracking code on all platforms
2. Ensure consistent user identification when possible
3. Configure cross-device matching rules
4. Set appropriate confidence thresholds

## Privacy compliance

When using identity resolution, ensure compliance with privacy regulations:

1. Obtain appropriate consent for data collection
2. Implement data retention policies
3. Provide 3. Provide transparency about data usage
4. Honor opt-out requests
5. Document your compliance measures

## Measuring identity resolution performance

Zeotap provides metrics to evaluate identity resolution:

1. **Match rate** - Percentage of users successfully matched
2. **Identity coverage** - Percentage of users with multiple identifiers
3. **Confidence distribution** - Distribution of match confidence scores
4. **Resolution impact** - Effect on audience reach and campaign performance

## Best practices

1. Collect high-quality first-party identifiers whenever possible
2. Use a consistent approach for identifier formatting
3. Regularly audit your identity graph for accuracy
4. Balance match rate with confidence thresholds
5. Consider privacy implications in all identity resolution strategies
    `,
    url: 'https://docs.zeotap.com/home/en-us/identity/',
    platform: 'zeotap'
  },
  
  // Cross-platform comparisons
  {
    id: 'comparison-1',
    title: 'Comparing audience creation across CDPs',
    content: `
# Comparing audience creation across CDPs

Each CDP has its own approach to audience creation and segmentation. Here's how they compare:

## Segment

Segment's audience creation focuses on:

- Event-based segmentation
- Real-time audience updates
- SQL-based audience definitions
- Integration with downstream tools

Key steps in Segment:
1. Define audience criteria using Segment's SQL-like interface
2. Select events and properties to include
3. Set update frequency
4. Activate the audience to destinations

## mParticle

mParticle's audience approach emphasizes:

- User attribute and behavior combinations
- Cross-platform audience consistency
- Audience A/B testing
- Real-time activation

Key steps in mParticle:
1. Use the audience builder to define criteria
2. Combine user attributes and behaviors
3. Set audience refresh rate
4. Forward to output platforms

## Lytics

Lytics differentiates with:

- Behavioral scoring
- Predictive modeling
- Machine learning-based segments
- Content affinity analysis

Key steps in Lytics:
1. Create behavioral scores based on user actions
2. Build segments using the visual segment builder
3. Incorporate predictive models if desired
4. Activate segments to campaigns

## Zeotap

Zeotap focuses on:

- Identity-based segmentation
- Third-party data enrichment
- Lookalike modeling
- Cross-device audience targeting

Key steps in Zeotap:
1. Define segment criteria in the segment builder
2. Incorporate first and third-party data
3. Apply identity resolution
4. Activate across channels

## Key differences

| Feature | Segment | mParticle | Lytics | Zeotap |
|---------|---------|-----------|--------|--------|
| Segmentation approach | SQL-based | Visual builder | Behavioral scoring | Identity-centric |
| Machine learning | Limited | Basic | Advanced | Moderate |
| Real-time capabilities | High | High | Moderate | Moderate |
| Data enrichment | Limited | Moderate | Moderate | Extensive |
| Identity resolution | Basic | Advanced | Moderate | Advanced |

## Choosing the right approach

Consider these factors when selecting a CDP for audience creation:

1. **Technical expertise** - Segment requires more technical knowledge
2. **Use case complexity** - Lytics excels at complex behavioral targeting
3. **Identity resolution needs** - Zeotap and mParticle offer stronger capabilities
4. **Integration requirements** - All platforms have different connector ecosystems
5. **Data volume and velocity** - Performance varies at different scales
    `,
    url: 'https://segment.com/docs/connections/destinations/catalog/',
    platform: 'segment'
  },
  {
    id: 'comparison-2',
    title: 'Data collection methods across CDPs',
    content: `
# Data collection methods across CDPs

Each CDP offers different methods for collecting customer data. Here's how they compare:

## Segment

Segment's data collection includes:

- JavaScript library for web
- Mobile SDKs (iOS, Android)
- Server-side libraries
- Cloud sources (SaaS integrations)

Key features:
- Single API for all data collection
- Client-side and server-side options
- Extensive validation and transformation
- Replay and backfill capabilities

## mParticle

mParticle's data collection includes:

- Web SDK
- Mobile SDKs with native features
- Server-to-server API
- Feeds (batch imports)

Key features:
- Built-in identity management
- Extensive mobile-specific capabilities
- Real-time data validation
- Flexible data planning tools

## Lytics

Lytics' data collection includes:

- JavaScript tag
- Mobile SDKs
- Server-side API
- Pre-built integrations

Key features:
- Behavioral event collection
- Content affinity tracking
- First-party cookie management
- Integration with marketing tools

## Zeotap

Zeotap's data collection includes:

- Web SDK
- Mobile SDKs
- Server API
- Batch file uploads
- Third-party data marketplace

Key features:
- Identity-focused collection
- Data enrichment capabilities
- Compliance management
- Cross-device tracking

## Implementation comparison

| Aspect | Segment | mParticle | Lytics | Zeotap |
|--------|---------|-----------|--------|--------|
| Web implementation | Simple snippet | Tag manager or direct | JavaScript tag | SDK or tag |
| Mobile support | Basic SDKs | Advanced SDKs | Basic SDKs | Standard SDKs |
| Server-side options | Multiple languages | Multiple languages | Limited languages | REST API |
| Setup complexity | Low to moderate | Moderate | Low | Moderate |
| Data validation | Extensive | Extensive | Basic | Moderate |

## Data collection best practices across platforms

Regardless of which CDP you choose, follow these best practices:

1. **Implement a data layer** - Create a consistent data layer for web and mobile
2. **Standardize event naming** - Use consistent naming conventions
3. **Plan your schema** - Define your data structure before implementation
4. **Validate data quality** - Set up monitoring for data quality issues
5. **Consider privacy** - Implement consent management for all collection methods
    `,
    url: 'https://docs.mparticle.com/developers/',
    platform: 'mparticle'
  }
];

// Export a function to get documentation by platform
export const getDocumentationByPlatform = (platform: string | null) => {
  if (!platform) {
    return documentationData;
  }
  
  return documentationData.filter(item => item.platform === platform);
};