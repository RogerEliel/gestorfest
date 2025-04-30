
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-100 py-6 border-t">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-gray-600 text-sm">
              © {currentYear} GestorFest. Todos os direitos reservados.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-4 md:gap-6">
            <Link to="/termos-de-uso" className="text-gray-600 hover:text-gray-900 text-sm">
              Termos de Uso
            </Link>
            <Link to="/politica-de-privacidade" className="text-gray-600 hover:text-gray-900 text-sm">
              Política de Privacidade
            </Link>
            <Link to="/politica-de-cookies" className="text-gray-600 hover:text-gray-900 text-sm">
              Política de Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
