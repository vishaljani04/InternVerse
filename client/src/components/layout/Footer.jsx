import { Link } from 'react-router-dom';
import { BarChart3, Mail, Phone, MapPin, Twitter, Linkedin, Github, Instagram } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-white border-t border-surface-200 pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand Column */}
                    <div className="space-y-6">
                        <Link to="/" className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-accent-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-200">
                                <BarChart3 size={22} className="text-white" />
                            </div>
                            <span className="font-bold text-surface-900 text-xl tracking-tight">InternVerse</span>
                        </Link>
                        <p className="text-surface-500 text-sm leading-relaxed">
                            Empowering the next generation of talent through seamless internship management and discovery. Join thousands of students building their careers today.
                        </p>
                        <div className="flex gap-4">
                            {[Twitter, Linkedin, Github, Instagram].map((Icon, i) => (
                                <a key={i} href="#" className="w-9 h-9 flex items-center justify-center rounded-lg bg-surface-50 text-surface-400 hover:bg-primary-50 hover:text-primary-600 transition-all">
                                    <Icon size={18} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-bold text-surface-900 mb-6">Discovery</h3>
                        <ul className="space-y-4">
                            {['Browse Internships', 'Popular Categories', 'Top Companies', 'Career Resources'].map((item) => (
                                <li key={item}>
                                    <Link to="/internships" className="text-surface-500 hover:text-primary-600 transition-colors text-sm font-medium">
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h3 className="font-bold text-surface-900 mb-6">For Partners</h3>
                        <ul className="space-y-4">
                            {['Post a Listing', 'HR Solutions', 'Corporate Program', 'Partner Success'].map((item) => (
                                <li key={item}>
                                    <Link to="/admin" className="text-surface-500 hover:text-primary-600 transition-colors text-sm font-medium">
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="font-bold text-surface-900 mb-6">Contact Us</h3>
                        <ul className="space-y-4">
                            <li className="flex gap-3 text-surface-500 text-sm">
                                <Mail size={18} className="text-primary-500 shrink-0" />
                                <a href="mailto:support@internverse.com" className="hover:text-primary-600 transition-colors">support@internverse.com</a>
                            </li>
                            <li className="flex gap-3 text-surface-500 text-sm">
                                <Phone size={18} className="text-primary-500 shrink-0" />
                                <span>+1 (555) 123-4567</span>
                            </li>
                            <li className="flex gap-3 text-surface-500 text-sm leading-relaxed">
                                <MapPin size={18} className="text-primary-500 shrink-0" />
                                <span>123 Innovation Way, Tech Park, CA 94105</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-surface-100 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-surface-400 text-xs text-center md:text-left">
                        © {new Date().getFullYear()} InternVerse - Internship Management System. All rights reserved.
                    </p>
                    <div className="flex gap-8">
                        <a href="#" className="text-surface-400 hover:text-surface-600 text-xs transition-colors">Privacy Policy</a>
                        <a href="#" className="text-surface-400 hover:text-surface-600 text-xs transition-colors">Terms of Service</a>
                        <a href="#" className="text-surface-400 hover:text-surface-600 text-xs transition-colors">Cookie Policy</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
