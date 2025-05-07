
import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Linkedin } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-100 py-12 border-t">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4 text-gray-700">GestorFest</h3>
            <p className="text-gray-600 text-sm mb-4">
              Plataforma completa para gerenciamento de eventos e convites.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-500 hover:text-primary-lighter" aria-label="Facebook">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-500 hover:text-primary-lighter" aria-label="Twitter">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-500 hover:text-primary-lighter" aria-label="Instagram">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-500 hover:text-primary-lighter" aria-label="LinkedIn">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4 text-gray-700">Produto</h3>
            <ul className="space-y-3 text-sm">
              <li><Link to="/build-in-public" className="text-gray-600 hover:text-gray-900">Build in Public</Link></li>
              <li><Link to="/api-docs" className="text-gray-600 hover:text-gray-900">API Docs</Link></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900">Casos de Uso</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900">Preços</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4 text-gray-700">Recursos</h3>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="text-gray-600 hover:text-gray-900">Blog</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900">Tutoriais</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900">Suporte</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900">Contato</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4 text-gray-700">Legal</h3>
            <ul className="space-y-3 text-sm">
              <li><Link to="/termos-de-uso" className="text-gray-600 hover:text-gray-900">Termos de Uso</Link></li>
              <li><Link to="/politica-de-privacidade" className="text-gray-600 hover:text-gray-900">Política de Privacidade</Link></li>
              <li><Link to="/politica-de-cookies" className="text-gray-600 hover:text-gray-900">Política de Cookies</Link></li>
              <li><Link to="/termo-de-consentimento" className="text-gray-600 hover:text-gray-900">Termo de Consentimento</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-600 text-sm">
            © {currentYear} GestorFest. Todos os direitos reservados.
          </p>
          
          <div className="flex flex-wrap gap-4 md:gap-6 mt-4 md:mt-0">
            <Link to="/termos-de-uso" className="text-gray-600 hover:text-gray-900 text-sm">
              Termos de Uso
            </Link>
            <Link to="/politica-de-privacidade" className="text-gray-600 hover:text-gray-900 text-sm">
              Política de Privacidade
            </Link>
            <Link to="/politica-de-cookies" className="text-gray-600 hover:text-gray-900 text-sm">
              Política de Cookies
            </Link>
            <Link to="/termo-de-consentimento" className="text-gray-600 hover:text-gray-900 text-sm">
              Termo de Consentimento
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
