
import { Calendar, DollarSign, TrendingUp, Users, Shield, BarChart3, Clock } from "lucide-react";

// If you have actual image imports, keep them. Otherwise, we'll use placeholder approaches
import { airbnb, binance, dropbox, coinbase, people02, people03, people01, facebook, instagram, linkedin, twitter } from "@/assets";

export const navLinks = [
  {
    id: "home",
    title: "Home",
  },
  {
    id: "features",
    title: "Features",
  },
  {
    id: "product",
    title: "Product",
  },
  {
    id: "clients",
    title: "Clients",
  },
  {
    id: "team",
    title: "Team",
  },
  {
    id: "podcast",
    title: "Podcast",
  },
];

export const stats = [
  {
    id: 1,
    name: 'Total Members',
    value: '2,400+',
    icon: Users,
    change: '+12%',
    changeType: 'positive',
  },
  {
    id: 2,
    name: 'Total Savings',
    value: 'KSh 12.8M',
    icon: DollarSign,
    change: '+8.2%',
    changeType: 'positive',
  },
  {
    id: 3,
    name: 'Active Loans',
    value: 'KSh 3.2M',
    icon: TrendingUp,
    change: '+4.3%',
    changeType: 'positive',
  },
  {
    id: 4,
    name: 'Monthly Meetings',
    value: '500+',
    icon: Calendar,
    change: '+2.1%',
    changeType: 'positive',
  },
];

export const features = [
  {
    id: "feature-1",
    icon: Shield, // Replaced icon01 with Lucide icon
    title: "Solution",
    content: "Members can apply for loans, track repayments, and view interest details. Loan disbursement and repayment schedules are managed here.",
  },
  {
    id: "feature-2",
    icon: BarChart3, // Replaced icon04 with Lucide icon
    title: "100% Secured",
    content: "We take proactive steps to make sure your information and transactions are secure.",
  },
  {
    id: "feature-3",
    icon: Clock, // Replaced icon07 with Lucide icon
    title: "Balance Transfer",
    content: "Ease Transfer of funds and detailed log of all contributions, withdrawals, loans, interest payments, and fines.",
  },
];

export const clients = [
  {
    id: "client-1",
    name: "Airbnb",
    logo: airbnb, // Keep if you have the actual image
  },
  {
    id: "client-2",
    name: "Binance",
    logo: binance, // Keep if you have the actual image
  },
  {
    id: "client-3",
    name: "Coinbase",
    logo: coinbase, // Keep if you have the actual image
  },
  {
    id: "client-4",
    name: "Dropbox",
    logo: dropbox, // Keep if you have the actual image
  },
];

export const team = [
  {
    id: "team-1",
    name: "Robbinson Mbugua",
    role: "Co-Founder / CEO",
    profile: people02, // Keep if you have the actual image
  },
  {
    id: "team-2",
    name: "Tony Mugo",
    role: "Co-Partner",
    profile: people03, // Keep if you have the actual image
  },
  {
    id: "team-3",
    name: "Norah Njeri",
    role: "Investor",
    profile: people01, // Keep if you have the actual image
  },
  {
    id: "team-4",
    name: "Sheila",
    role: "Developer",
    profile: people02, // Keep if you have the actual image
  },
];

export const footerLinks = [
  {
    title: "Useful Links",
    links: [
      {
        name: "Content",
        link: "https://www.krwallet.com/content/",
      },
      {
        name: "How it Works",
        link: "#how-it-works",
      },
      {
        name: "Create",
        link: "/create",
      },
      {
        name: "Explore",
        link: "/explore",
      },
      {
        name: "Terms & Services",
        link: "/terms",
      },
    ],
  },
  {
    title: "Community",
    links: [
      {
        name: "Help Center",
        link: "/help",
      },
      {
        name: "Partners",
        link: "/partners",
      },
      {
        name: "Suggestions",
        link: "/suggestions",
      },
      {
        name: "Blog",
        link: "/blog",
      },
      {
        name: "Newsletters",
        link: "/newsletters",
      },
    ],
  },
  {
    title: "Partner",
    links: [
      {
        name: "Our Partner",
        link: "/partners",
      },
      {
        name: "Become a Partner",
        link: "/become-partner",
      },
    ],
  },
];

export const socialMedia = [
  {
    id: "social-media-1",
    name: "Instagram",
    icon: instagram, 
    link: "https://www.instagram.com/",
  },
  {
    id: "social-media-2",
    name: "Facebook",
    icon: facebook, 
    link: "https://www.facebook.com/",
  },
  {
    id: "social-media-3",
    name: "Twitter",
     icon: twitter, 
    link: "https://www.twitter.com/",
  },
  {
    id: "social-media-4",
    name: "LinkedIn",
    icon: linkedin, 
    link: "https://www.linkedin.com/",
  },
];

