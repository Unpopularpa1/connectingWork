import React from "react";
import {
  Search,
  Shield,
  TrendingUp,
  Users,
  Building,
  MessageSquare,
  Star,
  DollarSign,
  Clock,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";

import HeroSection from "./HeroSection";
import FeaturesSection from "./FeaturesSection";
import WhyWorkConnect from "./WhyWorkConnect";
import StatsSection from "./StatsSection";
import CtaSection from "./CtaSection";


const WorkConnect = () => {
  return (
    <div className="min-h-screen bg-gray-50">
    
      <HeroSection  /> {/* Hero Section */}
      <FeaturesSection
        Search={Search}
        Shield={Shield}
        TrendingUp={TrendingUp}
      />  {/* Features Section */}
      
      <WhyWorkConnect
        MessageSquare={MessageSquare}
        Star={Star}
        DollarSign={DollarSign}
        Clock={Clock}
        AlertTriangle={AlertTriangle}
        CheckCircle={CheckCircle}
        Users={Users}
        Building={Building}
      />  {/* Why Choose WorkConnect Section */}
      
      <StatsSection /> {/* Stats Section */}

      <CtaSection 
      Users={Users} 
      Building={Building} 
      /> {/* CTA Section */}
      
    </div>
  );
};

export default WorkConnect;
