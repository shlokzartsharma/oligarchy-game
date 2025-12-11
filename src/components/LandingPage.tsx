import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Navigation from './Navigation';

const LandingPage = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-cream">
      <Navigation onNavigate={scrollToSection} />
      
      {/* Hero Section */}
      <section id="hero" className="min-h-screen flex items-center justify-center px-4 pt-20">
        <div className="max-w-6xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold text-navy mb-6"
          >
            Zorro: The Investing App
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-navy/70 mb-4 max-w-3xl mx-auto"
          >
            Building financial literacy and long-term generational wealth
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg text-navy/60 mb-12 max-w-2xl mx-auto"
          >
            Empowering individuals and families with the knowledge and tools to build lasting wealth through ethical investing and financial education.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link
              to="/quick-play"
              className="bg-navy text-cream px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105"
            >
              Try Quick Play Demo
            </Link>
            <button
              onClick={() => scrollToSection('about')}
              className="bg-gold text-navy px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105"
            >
              Learn More
            </button>
          </motion.div>
        </div>
      </section>

      {/* About/Origin Story Section */}
      <section id="about" className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold text-navy mb-8 text-center"
          >
            Our Origin Story
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="prose prose-lg max-w-none text-navy/80"
          >
            <p className="text-xl mb-6 leading-relaxed">
              The legend of Zorro—Don Diego de la Vega—represents a timeless commitment to defending the oppressed and fighting for justice. In the realm of modern finance, we see a parallel mission: empowering everyday people against a system that has historically favored the wealthy and well-connected.
            </p>
            <p className="text-xl mb-6 leading-relaxed">
              Just as Zorro used his skills and resources to protect the vulnerable, Zorro: The Investing App is dedicated to leveling the financial playing field. We believe that financial literacy and access to quality investment tools should not be privileges reserved for the few, but fundamental rights for all.
            </p>
            <div className="bg-cream p-8 rounded-lg border-l-4 border-gold">
              <p className="text-2xl font-semibold text-navy mb-2">Our Mission</p>
              <p className="text-xl text-navy/80">
                Building financial literacy and long-term generational wealth through ethical investing, comprehensive education, and equitable governance.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Three Pillars Section */}
      <section id="pillars" className="py-20 px-4 bg-cream">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold text-navy mb-12 text-center"
          >
            Our Three Pillars
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Pillar 1: Investment Excellence */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white p-8 rounded-lg shadow-lg"
            >
              <div className="text-4xl mb-4">📈</div>
              <h3 className="text-2xl font-bold text-navy mb-4">Investment Excellence</h3>
              <h4 className="text-xl font-semibold text-gold mb-3">Fiduciary Responsibility</h4>
              <ul className="space-y-2 text-navy/80">
                <li>• ETF portfolios targeting 8-14% returns</li>
                <li>• No selling order flow data</li>
                <li>• Strict fiduciary duty to clients</li>
                <li>• Transparent fee structure</li>
              </ul>
            </motion.div>

            {/* Pillar 2: Financial Literacy */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white p-8 rounded-lg shadow-lg"
            >
              <div className="text-4xl mb-4">📚</div>
              <h3 className="text-2xl font-bold text-navy mb-4">Financial Literacy Education</h3>
              <h4 className="text-xl font-semibold text-gold mb-3">Investment + Political Literacy</h4>
              <ul className="space-y-2 text-navy/80">
                <li>• Comprehensive investment education</li>
                <li>• Political literacy resources</li>
                <li>• Pro-bono programming for schools</li>
                <li>• Nonprofit partnerships</li>
              </ul>
            </motion.div>

            {/* Pillar 3: Equitable Governance */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white p-8 rounded-lg shadow-lg"
            >
              <div className="text-4xl mb-4">⚖️</div>
              <h3 className="text-2xl font-bold text-navy mb-4">Equitable Governance</h3>
              <h4 className="text-xl font-semibold text-gold mb-3">Balanced Stakeholder Interests</h4>
              <ul className="space-y-2 text-navy/80">
                <li>• 10% profits to nonprofits post-IPO</li>
                <li>• Stakeholder-first approach</li>
                <li>• Ethical business practices</li>
                <li>• Community impact focus</li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Overview Section */}
      <section id="services" className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold text-navy mb-12 text-center"
          >
            Our Services
          </motion.h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: 'Robo Advisor Platform',
                description: 'Automated portfolio management with globally diversified ETF strategies',
                icon: '🤖'
              },
              {
                title: 'Liquidity Management',
                description: 'High-yield savings accounts and money market funds for cash management',
                icon: '💧'
              },
              {
                title: 'Portfolio Construction',
                description: '8-12% target returns through globally diversified ETF portfolios',
                icon: '🏗️'
              },
              {
                title: 'Retirement & Estate Planning',
                description: 'IRAs, 529 plans, and custodial accounts for long-term wealth building',
                icon: '🏦'
              },
              {
                title: '401K Plans',
                description: 'Comprehensive retirement solutions for business owners and employees',
                icon: '💼'
              },
              {
                title: 'Financial Literacy Workshops',
                description: 'Educational programs for individuals, schools, and organizations',
                icon: '🎓'
              }
            ].map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-cream p-6 rounded-lg border border-navy/10 hover:shadow-lg transition-shadow"
              >
                <div className="text-3xl mb-3">{service.icon}</div>
                <h3 className="text-xl font-bold text-navy mb-2">{service.title}</h3>
                <p className="text-navy/70">{service.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Resources Section */}
      <section id="resources" className="py-20 px-4 bg-cream">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold text-navy mb-12 text-center"
          >
            Resources & Education
          </motion.h2>
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white p-8 rounded-lg shadow-lg"
            >
              <h3 className="text-2xl font-bold text-navy mb-4">Financial Literacy Library</h3>
              <ul className="space-y-3 text-navy/80">
                <li className="flex items-start">
                  <span className="text-gold mr-2">•</span>
                  <span>Budgeting & Money Management</span>
                </li>
                <li className="flex items-start">
                  <span className="text-gold mr-2">•</span>
                  <span>Investing Basics & Strategies</span>
                </li>
                <li className="flex items-start">
                  <span className="text-gold mr-2">•</span>
                  <span>Retirement Planning</span>
                </li>
                <li className="flex items-start">
                  <span className="text-gold mr-2">•</span>
                  <span>Estate Planning & Wealth Transfer</span>
                </li>
                <li className="flex items-start">
                  <span className="text-gold mr-2">•</span>
                  <span>Tax Optimization Strategies</span>
                </li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white p-8 rounded-lg shadow-lg"
            >
              <h3 className="text-2xl font-bold text-navy mb-4">Political Literacy Library</h3>
              <ul className="space-y-3 text-navy/80">
                <li className="flex items-start">
                  <span className="text-gold mr-2">•</span>
                  <span>Bill Tracking & Legislative Updates</span>
                </li>
                <li className="flex items-start">
                  <span className="text-gold mr-2">•</span>
                  <span>Union Resources & Organizing</span>
                </li>
                <li className="flex items-start">
                  <span className="text-gold mr-2">•</span>
                  <span>Policy Impact Analysis</span>
                </li>
                <li className="flex items-start">
                  <span className="text-gold mr-2">•</span>
                  <span>Civic Engagement Tools</span>
                </li>
                <li className="flex items-start">
                  <span className="text-gold mr-2">•</span>
                  <span>Financial Policy Education</span>
                </li>
              </ul>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-12 bg-white p-8 rounded-lg shadow-lg"
          >
            <h3 className="text-2xl font-bold text-navy mb-6 text-center">Additional Resources</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-xl font-semibold text-gold mb-3">Book Recommendations</h4>
                <p className="text-navy/80 mb-4">
                  Curated reading list covering personal finance, investing, economics, and financial history.
                </p>
              </div>
              <div>
                <h4 className="text-xl font-semibold text-gold mb-3">Financial Literacy Games</h4>
                <p className="text-navy/80 mb-4">
                  Interactive educational games to learn financial concepts through play.
                </p>
                <Link
                  to="/quick-play"
                  className="inline-block bg-navy text-cream px-6 py-3 rounded-full font-semibold hover:bg-navy/90 transition-colors"
                >
                  Try Quick Play Demo →
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer id="footer" className="bg-navy text-cream py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">Zorro</h3>
              <p className="text-cream/80">
                Building financial literacy and long-term generational wealth.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Navigation</h4>
              <ul className="space-y-2 text-cream/80">
                <li>
                  <button onClick={() => scrollToSection('about')} className="hover:text-gold transition-colors">
                    About
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('pillars')} className="hover:text-gold transition-colors">
                    Our Pillars
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('services')} className="hover:text-gold transition-colors">
                    Services
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('resources')} className="hover:text-gold transition-colors">
                    Resources
                  </button>
                </li>
                <li>
                  <Link to="/quick-play" className="hover:text-gold transition-colors">
                    Quick Play Demo
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Connect</h4>
              <div className="flex gap-4">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cream/80 hover:text-gold transition-colors"
                  aria-label="Instagram"
                >
                  Instagram
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cream/80 hover:text-gold transition-colors"
                  aria-label="LinkedIn"
                >
                  LinkedIn
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-cream/20 pt-8 text-center text-cream/60 text-sm">
            <p>&copy; {new Date().getFullYear()} Zorro: The Investing App. All rights reserved.</p>
            <p className="mt-2">
              This website is for informational purposes only. Investment products are not FDIC insured, may lose value, and are not bank guaranteed.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

