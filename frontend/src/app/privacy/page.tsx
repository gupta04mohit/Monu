"use client";

import { motion } from "framer-motion";
import { Shield, Lock, Eye, Server, CheckCircle, Users } from "lucide-react";

const principles = [
  {
    icon: Shield,
    title: "Privacy by Design",
    desc: "Every feature in VedaAI is architected with privacy as the default, not an afterthought. Your health data is yours — always.",
    color: "text-blue-500 bg-blue-500/10",
  },
  {
    icon: Lock,
    title: "End-to-End Encryption",
    desc: "All health records, chat logs, and wearable data are encrypted with AES-256 both in transit and at rest.",
    color: "text-green-500 bg-green-500/10",
  },
  {
    icon: Eye,
    title: "Zero Data Selling",
    desc: "We never sell or share your health data with advertisers, insurers, or third parties — period.",
    color: "text-purple-500 bg-purple-500/10",
  },
  {
    icon: Server,
    title: "Federated AI Learning",
    desc: "Our AI models are trained using Federated Learning — improving from aggregated patterns without ever exposing your individual data.",
    color: "text-orange-500 bg-orange-500/10",
  },
  {
    icon: Users,
    title: "Role-Based Access Control",
    desc: "Strict RBAC ensures only you (and doctors you explicitly authorize) can access your health records.",
    color: "text-rose-500 bg-rose-500/10",
  },
  {
    icon: CheckCircle,
    title: "HIPAA-Inspired Compliance",
    desc: "VedaAI follows HIPAA-inspired security controls and GDPR principles to ensure your rights are protected globally.",
    color: "text-teal-500 bg-teal-500/10",
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <Shield className="w-4 h-4" /> Privacy & Security
          </div>
          <h1 className="text-5xl font-bold text-foreground mb-4">
            Your Health Data is <span className="gradient-text">Sacred</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            VedaAI is built on a foundation of radical transparency, military-grade security, and a firm belief that you own your health data.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {principles.map((p, i) => {
            const Icon = p.icon;
            return (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-card border border-border rounded-3xl p-6 card-hover"
              >
                <div className={`inline-flex w-12 h-12 rounded-2xl items-center justify-center mb-4 ${p.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">{p.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{p.desc}</p>
              </motion.div>
            );
          })}
        </div>

        <div className="bg-primary/5 border border-primary/20 rounded-3xl p-10 text-center">
          <Shield className="w-16 h-16 text-primary mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-foreground mb-4">Our Security Promise</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
            We undergo regular third-party security audits, maintain a public bug bounty program, and publish annual transparency reports. If you ever have a security concern, email us at <span className="text-primary font-semibold">security@vedaai.health</span>.
          </p>
        </div>
      </div>
    </div>
  );
}
