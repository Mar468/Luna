import React, { useState, useMemo } from 'react';
import { 
  ShoppingBag, Search, Heart, Star, ShieldCheck, Truck, Sparkles, 
  X, Plus, Minus, Check, ChevronRight, MessageCircle, ArrowRight, Menu, 
  HelpCircle, RefreshCw, Send, CheckCircle2
} from 'lucide-react';

// Product type definition
interface Product {
  id: string;
  name: string;
  category: 'sets' | 'leggings' | 'tops' | 'shorts' | 'premium';
  price: number; // in Gs. (Guaraníes)
  originalPrice?: number;
  image: string;
  badge?: string;
  description: string;
  colors: string[];
  sizes: string[];
  rating: number;
  reviewsCount: number;
}

interface CartItem {
  product: Product;
  selectedSize: string;
  selectedColor: string;
  quantity: number;
}

const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Set Premium Seamless',
    category: 'sets',
    price: 250000,
    originalPrice: 320000,
    image: '/src/assets/images/product_seamless_set_1791514312317.jpg',
    badge: 'Más Vendido',
    description: 'Conjunto deportivo de alta compresión sin costuras (Seamless). Tela inteligente ultra transpirable que se adapta perfectamente a tu silueta.',
    colors: ['Rosa Antiguo', 'Negro Obsidiana', 'Gris Perla'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    rating: 4.9,
    reviewsCount: 128
  },
  {
    id: '2',
    name: 'Legging Efecto Push Up',
    category: 'leggings',
    price: 180000,
    originalPrice: 230000,
    image: '/src/assets/images/product_pushup_legging_1791514324743.jpg',
    badge: 'Nuevo',
    description: 'Legging de cintura alta con efecto modelador push-up. Costuras estratégicas que realzan la figura y garantizan 0% transparencias.',
    colors: ['Rosa Berry', 'Azul Marino', 'Negro Mate'],
    sizes: ['XS', 'S', 'M', 'L'],
    rating: 4.8,
    reviewsCount: 94
  },
  {
    id: '3',
    name: 'Top de Alto Impacto',
    category: 'tops',
    price: 120000,
    originalPrice: 150000,
    image: '/src/assets/images/product_high_impact_top_1791514337492.jpg',
    badge: 'Favorito',
    description: 'Top deportivo con soporte de alto impacto y tirantes cruzados en la espalda. Incluye copas removibles y elástico de sujeción firme.',
    colors: ['Rosa Quartz', 'Blanco Nieve', 'Negro'],
    sizes: ['S', 'M', 'L'],
    rating: 4.9,
    reviewsCount: 81
  },
  {
    id: '4',
    name: 'Biker Short Deportivo',
    category: 'shorts',
    price: 95000,
    originalPrice: 130000,
    image: '/src/assets/images/product_biker_short_1791514351513.jpg',
    badge: 'Oferta -25%',
    description: 'Short biker de talle alto con control de abdomen. Ideal para running, yoga o entrenamientos intensos de fuerza.',
    colors: ['Blush Pink', 'Verde Oliva', 'Negro'],
    sizes: ['XS', 'S', 'M', 'L'],
    rating: 4.7,
    reviewsCount: 65
  },
  {
    id: '5',
    name: 'Conjunto Ombré Fitness',
    category: 'sets',
    price: 280000,
    originalPrice: 350000,
    image: '/src/assets/images/hero_lunarosa_banner_1791514301414.jpg',
    badge: 'Exclusivo',
    description: 'Conjunto de dos piezas con degradé ombré y textura acanalada de máxima suavidad y elasticidad en 4 direcciones.',
    colors: ['Rosa / Fucsia', 'Calipso / Azul', 'Gris / Negro'],
    sizes: ['S', 'M', 'L'],
    rating: 5.0,
    reviewsCount: 42
  },
  {
    id: '6',
    name: 'Chaqueta Deportiva con Cierre',
    category: 'premium',
    price: 210000,
    image: '/src/assets/images/product_seamless_set_1791514312317.jpg',
    description: 'Chaqueta ligera con cierre frontal, bolsillos invisibles y aberturas para pulgares en las mangas. Estilo y comodidad inigualables.',
    colors: ['Rosa Dust', 'Negro', 'Gris Heather'],
    sizes: ['S', 'M', 'L', 'XL'],
    rating: 4.8,
    reviewsCount: 39
  },
  {
    id: '7',
    name: 'Short con Falda Tenis',
    category: 'shorts',
    price: 140000,
    originalPrice: 175000,
    image: '/src/assets/images/product_biker_short_1791514351513.jpg',
    description: 'Falda short plisada con short interno de compresión y bolsillo oculto para celular o llaves. Tendencia absoluta.',
    colors: ['Rosa Pastel', 'Blanco', 'Negro'],
    sizes: ['XS', 'S', 'M', 'L'],
    rating: 4.9,
    reviewsCount: 53
  },
  {
    id: '8',
    name: 'Top Crop Manga Larga',
    category: 'tops',
    price: 155000,
    image: '/src/assets/images/product_high_impact_top_1791514337492.jpg',
    description: 'Crop top de manga larga con ojal para pulgar y tejido térmico transpirable para entrenar en días frescos.',
    colors: ['Rosa Nude', 'Negro', 'Vino Tinto'],
    sizes: ['S', 'M', 'L'],
    rating: 4.7,
    reviewsCount: 27
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState<'inicio' | 'colecciones' | 'lo-nuevo' | 'contacto'>('inicio');
  const [selectedCategory, setSelectedCategory] = useState<'todos' | 'sets' | 'leggings' | 'tops' | 'shorts' | 'premium'>('todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  // Checkout form state
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [customerCity, setCustomerCity] = useState('Asunción');
  const [paymentMethod, setPaymentMethod] = useState<'transferencia' | 'giros' | 'contra-entrega'>('transferencia');

  // Filtered products
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter(p => {
      const matchesCat = selectedCategory === 'todos' || p.category === selectedCategory;
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            p.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const totalCartItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const shippingCost = cartSubtotal > 300000 ? 0 : 25000;
  const cartTotal = cartSubtotal + (cart.length > 0 ? shippingCost : 0);

  const formatGs = (amount: number) => {
    return amount.toLocaleString('es-PY') + ' Gs.';
  };

  const addToCart = (product: Product, size?: string, color?: string) => {
    const sizeToUse = size || product.sizes[0];
    const colorToUse = color || product.colors[0];

    setCart(prev => {
      const existingIndex = prev.findIndex(
        item => item.product.id === product.id && item.selectedSize === sizeToUse && item.selectedColor === colorToUse
      );
      if (existingIndex > -1) {
        const copy = [...prev];
        copy[existingIndex].quantity += 1;
        return copy;
      }
      return [...prev, { product, selectedSize: sizeToUse, selectedColor: colorToUse, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (index: number, delta: number) => {
    setCart(prev => {
      const copy = [...prev];
      const newQty = copy[index].quantity + delta;
      if (newQty <= 0) {
        copy.splice(index, 1);
      } else {
        copy[index].quantity = newQty;
      }
      return copy;
    });
  };

  const toggleWishlist = (productId: string) => {
    setWishlist(prev => 
      prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
    );
  };

  const handleWhatsAppCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone || !customerAddress) {
      alert('Por favor complete su nombre, teléfono y dirección de entrega.');
      return;
    }

    const itemsSummary = cart.map(i => `• ${i.quantity}x ${i.product.name} (Talle: ${i.selectedSize}, Color: ${i.selectedColor}) - ${formatGs(i.product.price * i.quantity)}`).join('%0A');
    const message = `¡Hola! 👋 Quiero realizar el siguiente pedido en *Luna Rosa Store*:%0A%0A${itemsSummary}%0A%0A*Subtotal:* ${formatGs(cartSubtotal)}%0A*Envío:* ${shippingCost === 0 ? '¡Gratis! 🎉' : formatGs(shippingCost)}%0A*Total a Pagar:* ${formatGs(cartTotal)}%0A%0A*Datos de Envío:*%0A👤 Nombre: ${customerName}%0A📞 Teléfono: ${customerPhone}%0A📍 Dirección: ${customerAddress}, ${customerCity}%0A💳 Pago: ${paymentMethod}%0A%0A¡Quedo a la espera de la confirmación!`;

    window.open(`https://wa.me/595981000000?text=${message}`, '_blank');
    setOrderSuccess(true);
  };

  return (
    <div className="min-h-screen bg-[#FCF8F9] text-[#333333] flex flex-col selection:bg-[#F4E3E7] selection:text-[#D81B60]">
      
      {/* TOP NOTIFICATION BAR */}
      <div className="bg-[#D81B60] text-white py-2 px-4 text-center text-xs md:text-sm font-medium tracking-wide">
        ✨ ¡Gran Apertura Luna Rosa! Envíos gratis en compras a partir de 300.000 Gs. en todo Paraguay 🇵🇾
      </div>

      {/* TOP NAVIGATION BAR (3-zone contract compliant) */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#F4E3E7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-8">
          
          {/* Zone 1: Brand Wordmark */}
          <div className="flex items-center gap-3 cursor-pointer shrink-0" onClick={() => setActiveTab('inicio')}>
            <div className="w-10 h-10 rounded-full bg-[#FCE4EC] flex items-center justify-center border border-[#F4E3E7]">
              <span className="text-[#D81B60] font-bold text-lg">LR</span>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-[#D81B60]">LUNA ROSA</h1>
              <p className="text-[10px] tracking-[0.2em] text-gray-500 font-semibold uppercase">Store</p>
            </div>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-700">
            <button 
              onClick={() => { setActiveTab('inicio'); setSelectedCategory('todos'); }}
              className={`transition-colors whitespace-nowrap shrink-0 hover:text-[#D81B60] ${activeTab === 'inicio' ? 'text-[#D81B60] font-semibold border-b-2 border-[#D81B60] pb-1' : ''}`}
            >
              Inicio
            </button>
            <button 
              onClick={() => { setActiveTab('colecciones'); setSelectedCategory('todos'); }}
              className={`transition-colors whitespace-nowrap shrink-0 hover:text-[#D81B60] ${activeTab === 'colecciones' ? 'text-[#D81B60] font-semibold border-b-2 border-[#D81B60] pb-1' : ''}`}
            >
              Colecciones
            </button>
            <button 
              onClick={() => { setActiveTab('lo-nuevo'); setSelectedCategory('todos'); }}
              className={`transition-colors whitespace-nowrap shrink-0 hover:text-[#D81B60] ${activeTab === 'lo-nuevo' ? 'text-[#D81B60] font-semibold border-b-2 border-[#D81B60] pb-1' : ''}`}
            >
              Lo Nuevo
            </button>
            <button 
              onClick={() => setActiveTab('contacto')}
              className={`transition-colors whitespace-nowrap shrink-0 hover:text-[#D81B60] ${activeTab === 'contacto' ? 'text-[#D81B60] font-semibold border-b-2 border-[#D81B60] pb-1' : ''}`}
            >
              Contacto
            </button>
          </nav>

          {/* Zone 3: Primary Actions (Search, Wishlist, Cart) */}
          <div className="flex items-center gap-4 shrink-0">
            <div className="hidden lg:flex items-center bg-[#FCF8F9] border border-[#F4E3E7] rounded-full px-3 py-1.5 w-60">
              <Search className="w-4 h-4 text-gray-400 mr-2" />
              <input 
                type="text" 
                placeholder="Buscar leggings, tops..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="bg-transparent text-xs outline-none w-full text-gray-800 placeholder-gray-400"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="text-gray-400 hover:text-gray-600">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative bg-[#D81B60] hover:bg-[#ad1457] text-white px-4 py-2.5 rounded-full text-xs font-semibold flex items-center gap-2 transition-all shadow-sm whitespace-nowrap shrink-0"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Carrito</span>
              <span className="bg-white text-[#D81B60] px-1.5 py-0.5 rounded-full text-[10px] font-bold">
                {totalCartItems}
              </span>
            </button>

            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-700 hover:text-[#D81B60]"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-[#F4E3E7] px-6 py-4 space-y-3">
            <div className="flex items-center bg-[#FCF8F9] border border-[#F4E3E7] rounded-full px-3 py-2 mb-4">
              <Search className="w-4 h-4 text-gray-400 mr-2" />
              <input 
                type="text" 
                placeholder="Buscar productos..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="bg-transparent text-sm outline-none w-full text-gray-800"
              />
            </div>
            <button 
              onClick={() => { setActiveTab('inicio'); setMobileMenuOpen(false); }}
              className="block w-full text-left py-2 font-medium text-gray-800 hover:text-[#D81B60]"
            >
              Inicio
            </button>
            <button 
              onClick={() => { setActiveTab('colecciones'); setMobileMenuOpen(false); }}
              className="block w-full text-left py-2 font-medium text-gray-800 hover:text-[#D81B60]"
            >
              Colecciones
            </button>
            <button 
              onClick={() => { setActiveTab('lo-nuevo'); setMobileMenuOpen(false); }}
              className="block w-full text-left py-2 font-medium text-gray-800 hover:text-[#D81B60]"
            >
              Lo Nuevo
            </button>
            <button 
              onClick={() => { setActiveTab('contacto'); setMobileMenuOpen(false); }}
              className="block w-full text-left py-2 font-medium text-gray-800 hover:text-[#D81B60]"
            >
              Contacto
            </button>
          </div>
        )}
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1">
        {activeTab === 'contacto' ? (
          <div className="max-w-4xl mx-auto px-4 py-16">
            <div className="bg-white border border-[#F4E3E7] rounded-2xl p-8 md:p-12 shadow-sm text-center">
              <div className="w-16 h-16 bg-[#FCE4EC] rounded-full flex items-center justify-center mx-auto mb-6 text-[#D81B60]">
                <MessageCircle className="w-8 h-8" />
              </div>
              <h2 className="text-3xl font-bold text-[#D81B60] mb-4">Atención al Cliente & Asesoramiento</h2>
              <p className="text-gray-600 max-w-xl mx-auto mb-8">
                ¿Tenés dudas sobre tu talle, querés ver más fotos o necesitás asesoramiento personalizado? Escribinos directamente a nuestro WhatsApp oficial. ¡Te respondemos al instante!
              </p>
              <a 
                href="https://wa.me/595981000000?text=¡Hola!%20Me%20gustaría%20recibir%20asesoramiento%20sobre%20la%20ropa%20deportiva%20de%20Luna%20Rosa."
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-3 bg-[#25D366] hover:bg-[#20ba5a] text-white px-8 py-4 rounded-full font-bold text-lg shadow-md transition-all transform hover:-translate-y-0.5"
              >
                <MessageCircle className="w-6 h-6" />
                Chat con Asesora en WhatsApp
              </a>
              <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-left border-t border-gray-100 pt-8">
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">📍 Showroom & Envíos</h4>
                <p className="text-sm text-gray-600">Asunción, Paraguay. Envíos a todo el país por courier seguro.</p>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">⏰ Horario de Atención</h4>
                  <p className="text-sm text-gray-600">Lunes a Sábados: 08:00 - 19:00 hs.</p>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">📧 Correo Electrónico</h4>
                  <p className="text-sm text-gray-600">contacto@lunarosastore.py</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* HERO SECTION */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
              <div className="bg-[#FCE4EC] rounded-3xl p-8 md:p-16 border border-[#F4E3E7] relative overflow-hidden shadow-sm">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  <div className="lg:col-span-7 space-y-6 z-10">
                    <div className="inline-flex items-center gap-2 bg-white/80 text-[#D81B60] px-4 py-1.5 rounded-full text-xs font-bold shadow-xs">
                      <Sparkles className="w-3.5 h-3.5" /> Colección Oficial 2026
                    </div>
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#D81B60] tracking-tight leading-tight">
                      ¡Gran Apertura Luna Rosa!
                    </h1>
                    <p className="text-lg md:text-xl text-gray-700 max-w-xl font-normal leading-relaxed">
                      Llévate lo mejor en <strong className="text-gray-900 font-semibold">Ropa Deportiva Premium</strong> con hasta un <span className="bg-[#D81B60] text-white px-2 py-0.5 rounded font-bold">50% de Descuento</span> por tiempo limitado.
                    </p>
                    <div className="flex flex-wrap items-center gap-4 pt-4">
                      <button 
                        onClick={() => {
                          const catalogEl = document.getElementById('catalogo');
                          catalogEl?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="bg-[#D81B60] hover:bg-[#ad1457] text-white font-bold px-8 py-4 rounded-full shadow-md transition-all flex items-center gap-2"
                      >
                        Ver Catálogo Completo <ArrowRight className="w-4 h-4" />
                      </button>
                      <a 
                        href="https://wa.me/595981000000?text=¡Hola!%20Visité%20su%20página%20web%20y%20me%20gustaría%20ver%20el%20catálogo%20completo%20de%20ropa%20deportiva." 
                        target="_blank" 
                        rel="noreferrer"
                        className="bg-white hover:bg-gray-50 text-[#D81B60] border border-[#D81B60]/30 font-bold px-8 py-4 rounded-full transition-all flex items-center gap-2"
                      >
                        <MessageCircle className="w-4 h-4 text-[#25D366]" /> Pedir por WhatsApp
                      </a>
                    </div>
                  </div>

                  <div className="lg:col-span-5 flex justify-center z-10">
                    <div className="relative w-72 h-72 sm:w-80 sm:h-80 rounded-full bg-white p-4 shadow-xl border-4 border-white/80 flex items-center justify-center overflow-hidden">
                      <img 
                        src="/src/assets/images/hero_lunarosa_banner_1791514301414.jpg" 
                        alt="Luna Rosa Store" 
                        className="w-full h-full object-cover rounded-full"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#D81B60]/20 to-transparent rounded-full pointer-events-none" />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* CATEGORIES SECTION */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl md:text-3xl font-extrabold text-[#D81B60]">Explora Categorías</h2>
                <div className="h-[1px] bg-[#F4E3E7] flex-1 ml-6 hidden sm:block" />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                {[
                  { id: 'todos', label: 'Todas las Prendas', icon: '✨' },
                  { id: 'sets', label: 'Leggings & Sets', icon: '🔥' },
                  { id: 'leggings', label: 'Leggings Push Up', icon: '💫' },
                  { id: 'tops', label: 'Tops Deportivos', icon: '⭐' },
                  { id: 'shorts', label: 'Shorts & Faldas', icon: '✨' },
                  { id: 'premium', label: 'Colección Premium', icon: '💎' }
                ].map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id as any)}
                    className={`p-5 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-2 ${selectedCategory === cat.id ? 'bg-[#D81B60] text-white border-[#D81B60] shadow-md scale-102' : 'bg-white text-gray-800 border-[#F4E3E7] hover:border-[#D81B60]/50 hover:bg-[#FCF8F9]'}`}
                  >
                    <span className="text-2xl">{cat.icon}</span>
                    <span className="font-bold text-xs sm:text-sm">{cat.label}</span>
                  </button>
                ))}
              </div>
            </section>

            {/* PRODUCT CATALOG SECTION */}
            <section id="catalogo" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
                <div>
                  <h2 className="text-2xl md:text-3xl font-extrabold text-[#D81B60]">
                    {selectedCategory === 'todos' ? 'Productos Destacados' : `Colección ${selectedCategory.toUpperCase()}`}
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1">
                    Mostrando {filteredProducts.length} prendas con telas inteligentes de alta compresión.
                  </p>
                </div>
              </div>

              {filteredProducts.length === 0 ? (
                <div className="bg-white border border-[#F4E3E7] rounded-2xl p-12 text-center">
                  <p className="text-gray-500 text-lg mb-4">No se encontraron productos con esos filtros o búsqueda.</p>
                  <button 
                    onClick={() => { setSelectedCategory('todos'); setSearchQuery(''); }}
                    className="bg-[#D81B60] text-white px-6 py-2.5 rounded-full text-sm font-bold"
                  >
                    Ver Todos los Productos
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {filteredProducts.map(product => {
                    const isWishlisted = wishlist.includes(product.id);
                    return (
                      <div 
                        key={product.id}
                        className="bg-white border border-[#F4E3E7] rounded-2xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col group"
                      >
                        <div className="relative aspect-4/3 bg-[#F9F9F9] overflow-hidden cursor-pointer" onClick={() => setSelectedProduct(product)}>
                          <img 
                            src={product.image} 
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            referrerPolicy="no-referrer"
                          />
                          {product.badge && (
                            <span className="absolute top-3 left-3 bg-[#D81B60] text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-xs">
                              {product.badge}
                            </span>
                          )}
                          <button 
                            onClick={(e) => { e.stopPropagation(); toggleWishlist(product.id); }}
                            className={`absolute top-3 right-3 p-2 rounded-full transition-colors ${isWishlisted ? 'bg-rose-500 text-white' : 'bg-white/80 backdrop-blur-xs text-gray-600 hover:text-rose-500'}`}
                          >
                            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
                          </button>
                        </div>

                        <div className="p-5 flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center gap-1 text-xs text-amber-500 mb-1">
                              <Star className="w-3.5 h-3.5 fill-current" />
                              <span className="font-bold text-gray-800">{product.rating}</span>
                              <span className="text-gray-400">({product.reviewsCount})</span>
                            </div>
                            <h3 
                              onClick={() => setSelectedProduct(product)}
                              className="font-bold text-gray-900 text-base mb-1 cursor-pointer hover:text-[#D81B60] transition-colors"
                            >
                              {product.name}
                            </h3>
                            <p className="text-xs text-gray-500 line-clamp-2 mb-4">{product.description}</p>
                          </div>

                          <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                            <div>
                              <span className="text-lg font-black text-[#D81B60] tabular-nums">
                                {formatGs(product.price)}
                              </span>
                              {product.originalPrice && (
                                <span className="block text-[11px] text-gray-400 line-through tabular-nums">
                                  {formatGs(product.originalPrice)}
                                </span>
                              )}
                            </div>
                            <button 
                              onClick={() => addToCart(product)}
                              className="bg-[#D81B60] hover:bg-[#ad1457] text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
                            >
                              <ShoppingBag className="w-3.5 h-3.5" /> Comprar
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            {/* STORE ADVANTAGES */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <div className="bg-white border border-[#F4E3E7] rounded-3xl p-8 md:p-12 shadow-xs">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                  <div className="flex flex-col items-center">
                    <div className="w-14 h-14 rounded-full bg-[#FCE4EC] flex items-center justify-center text-[#D81B60] mb-4">
                      <Sparkles className="w-7 h-7" />
                    </div>
                    <h3 className="font-bold text-lg text-gray-900 mb-2">Calidad Premium</h3>
                    <p className="text-sm text-gray-600">Telas inteligentes, transpirables y de alta compresión que moldean sin apretar.</p>
                  </div>
                  <div className="flex flex-col items-center border-y md:border-y-0 md:border-x border-[#F4E3E7] py-6 md:py-0 md:px-6">
                    <div className="w-14 h-14 rounded-full bg-[#FCE4EC] flex items-center justify-center text-[#D81B60] mb-4">
                      <ShieldCheck className="w-7 h-7" />
                    </div>
                    <h3 className="font-bold text-lg text-gray-900 mb-2">Pago 100% Seguro</h3>
                    <p className="text-sm text-gray-600">Tus transacciones y datos están protegidos con los más altos estándares.</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-14 h-14 rounded-full bg-[#FCE4EC] flex items-center justify-center text-[#D81B60] mb-4">
                      <Truck className="w-7 h-7" />
                    </div>
                    <h3 className="font-bold text-lg text-gray-900 mb-2">Envíos Confiables</h3>
                    <p className="text-sm text-gray-600">Llegamos directo hasta la puerta de tu casa en Asunción y todo Paraguay.</p>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}
      </main>

      {/* FOOTER */}
      <footer className="bg-white border-t border-[#F4E3E7] mt-16 text-gray-600 text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#FCE4EC] flex items-center justify-center text-[#D81B60] font-bold text-sm">
                  LR
                </div>
                <span className="font-extrabold text-[#D81B60] text-lg tracking-tight">LUNA ROSA STORE</span>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">
                Ropa deportiva premium diseñada para mujeres que buscan comodidad, confianza y estilo en cada entrenamiento.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-gray-900 mb-3 text-xs uppercase tracking-wider">Categorías</h4>
              <ul className="space-y-2 text-xs">
                <li><button onClick={() => { setSelectedCategory('sets'); setActiveTab('inicio'); }} className="hover:text-[#D81B60]">Sets & Conjuntos</button></li>
                <li><button onClick={() => { setSelectedCategory('leggings'); setActiveTab('inicio'); }} className="hover:text-[#D81B60]">Leggings Push Up</button></li>
                <li><button onClick={() => { setSelectedCategory('tops'); setActiveTab('inicio'); }} className="hover:text-[#D81B60]">Tops Deportivos</button></li>
                <li><button onClick={() => { setSelectedCategory('shorts'); setActiveTab('inicio'); }} className="hover:text-[#D81B60]">Shorts & Faldas</button></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-gray-900 mb-3 text-xs uppercase tracking-wider">Atención al Cliente</h4>
              <ul className="space-y-2 text-xs">
                <li><a href="https://wa.me/595981000000" target="_blank" rel="noreferrer" className="hover:text-[#D81B60]">Consultas por WhatsApp</a></li>
                <li><button onClick={() => setActiveTab('contacto')} className="hover:text-[#D81B60]">Guía de Talles</button></li>
                <li><button onClick={() => setActiveTab('contacto')} className="hover:text-[#D81B60]">Políticas de Envíos</button></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-gray-900 mb-3 text-xs uppercase tracking-wider">Contacto & Redes</h4>
              <p className="text-xs text-gray-500 mb-2">Asunción, Paraguay 🇵🇾</p>
              <p className="text-xs font-bold text-[#D81B60] mb-4">+595 981 000 000</p>
              <div className="flex items-center gap-3">
                <a href="https://wa.me/595981000000" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-[#FCE4EC] text-[#D81B60] flex items-center justify-center hover:bg-[#D81B60] hover:text-white transition-colors">
                  <MessageCircle className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400">
            <p>© 2026 Luna Rosa Store. Todos los derechos reservados.</p>
            <p className="mt-2 sm:mt-0">Ropa Deportiva Premium en Paraguay 🇵🇾</p>
          </div>
        </div>
      </footer>

      {/* PRODUCT DETAIL MODAL */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-[#F4E3E7] animate-in fade-in zoom-in duration-200">
            <div className="relative bg-[#F9F9F9] aspect-video">
              <img 
                src={selectedProduct.image} 
                alt={selectedProduct.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <button 
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 right-4 bg-white/90 text-gray-700 hover:text-black p-2 rounded-full shadow-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 md:p-8 space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#D81B60] bg-[#FCE4EC] px-3 py-1 rounded-full">
                  {selectedProduct.category}
                </span>
                <h3 className="text-2xl font-bold text-gray-900 mt-2">{selectedProduct.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex text-amber-500">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="font-bold text-sm text-gray-800 ml-1">{selectedProduct.rating}</span>
                  </div>
                  <span className="text-gray-400 text-xs">({selectedProduct.reviewsCount} opiniones verificadas)</span>
                </div>
              </div>

              <p className="text-sm text-gray-600 leading-relaxed">{selectedProduct.description}</p>

              {/* Size Selector */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">Seleccionar Talle:</label>
                <div className="flex gap-2">
                  {selectedProduct.sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-12 h-12 rounded-xl font-bold text-sm border transition-all ${selectedSize === size || (!selectedSize && size === selectedProduct.sizes[0]) ? 'bg-[#D81B60] text-white border-[#D81B60] shadow-sm' : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400'}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Selector */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">Seleccionar Color:</label>
                <div className="flex flex-wrap gap-2">
                  {selectedProduct.colors.map(color => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${selectedColor === color || (!selectedColor && color === selectedProduct.colors[0]) ? 'bg-[#D81B60] text-white border-[#D81B60]' : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400'}`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                <div>
                  <span className="text-2xl font-black text-[#D81B60] tabular-nums">
                    {formatGs(selectedProduct.price)}
                  </span>
                  {selectedProduct.originalPrice && (
                    <span className="block text-xs text-gray-400 line-through tabular-nums">
                      {formatGs(selectedProduct.originalPrice)}
                    </span>
                  )}
                </div>
                <button 
                  onClick={() => {
                    addToCart(
                      selectedProduct, 
                      selectedSize || selectedProduct.sizes[0], 
                      selectedColor || selectedProduct.colors[0]
                    );
                    setSelectedProduct(null);
                  }}
                  className="bg-[#D81B60] hover:bg-[#ad1457] text-white px-8 py-3.5 rounded-2xl font-bold text-sm shadow-md transition-all flex items-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" /> Agregar al Carrito
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CART & CHECKOUT DRAWER */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end">
          <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            
            {/* Drawer Header */}
            <div className="p-6 border-b border-[#F4E3E7] flex items-center justify-between bg-[#FCF8F9]">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-[#D81B60]" />
                <h3 className="font-bold text-lg text-gray-900">Tu Carrito ({totalCartItems})</h3>
              </div>
              <button 
                onClick={() => { setIsCartOpen(false); setOrderSuccess(false); }}
                className="p-2 text-gray-400 hover:text-gray-700 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {orderSuccess ? (
              <div className="p-8 flex-1 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-2xl font-bold text-gray-900 mb-2">¡Pedido Enviado!</h4>
                <p className="text-sm text-gray-600 mb-6">
                  Se abrió WhatsApp con el resumen de tu pedido. Una asesora te contactará para confirmar el envío a {customerCity}.
                </p>
                <button 
                  onClick={() => {
                    setCart([]);
                    setOrderSuccess(false);
                    setIsCartOpen(false);
                  }}
                  className="bg-[#D81B60] text-white px-6 py-3 rounded-xl font-bold text-sm"
                >
                  Volver a la Tienda
                </button>
              </div>
            ) : cart.length === 0 ? (
              <div className="p-8 flex-1 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-[#FCE4EC] text-[#D81B60] rounded-full flex items-center justify-center mb-4">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h4 className="font-bold text-gray-900 text-lg mb-1">Tu carrito está vacío</h4>
                <p className="text-xs text-gray-500 mb-6">Explorá nuestras colecciones y añadí tus prendas favoritas.</p>
                <button 
                  onClick={() => setIsCartOpen(false)}
                  className="bg-[#D81B60] text-white px-6 py-3 rounded-full text-xs font-bold"
                >
                  Ver Prendas
                </button>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                
                {/* Cart Items List */}
                <div className="space-y-4">
                  {cart.map((item, idx) => (
                    <div key={idx} className="flex gap-4 items-center bg-[#FCF8F9] p-3 rounded-2xl border border-[#F4E3E7]">
                      <img src={item.product.image} alt={item.product.name} className="w-16 h-16 object-cover rounded-xl" referrerPolicy="no-referrer" />
                      <div className="flex-1">
                        <h4 className="font-bold text-xs text-gray-900">{item.product.name}</h4>
                        <p className="text-[11px] text-gray-500">Talle: {item.selectedSize} | Color: {item.selectedColor}</p>
                        <p className="text-xs font-black text-[#D81B60] mt-1 tabular-nums">{formatGs(item.product.price)}</p>
                      </div>
                      <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg p-1">
                        <button onClick={() => updateQuantity(idx, -1)} className="p-1 text-gray-600 hover:text-black">
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold w-4 text-center tabular-nums">{item.quantity}</span>
                        <button onClick={() => updateQuantity(idx, 1)} className="p-1 text-gray-600 hover:text-black">
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Checkout Form */}
                <form onSubmit={handleWhatsAppCheckout} className="space-y-4 pt-4 border-t border-gray-100">
                  <h4 className="font-bold text-gray-900 text-sm">Datos para el Envío en Paraguay</h4>
                  
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Nombre y Apellido *</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Ej. María Rojas"
                      value={customerName}
                      onChange={e => setCustomerName(e.target.value)}
                      className="w-full bg-[#FCF8F9] border border-gray-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-[#D81B60]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">WhatsApp / Teléfono *</label>
                    <input 
                      type="tel" 
                      required
                      placeholder="Ej. 0981 123 456"
                      value={customerPhone}
                      onChange={e => setCustomerPhone(e.target.value)}
                      className="w-full bg-[#FCF8F9] border border-gray-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-[#D81B60]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Ciudad *</label>
                      <select 
                        value={customerCity}
                        onChange={e => setCustomerCity(e.target.value)}
                        className="w-full bg-[#FCF8F9] border border-gray-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-[#D81B60]"
                      >
                        <option value="Asunción">Asunción</option>
                        <option value="San Lorenzo">San Lorenzo</option>
                        <option value="Luque">Luque</option>
                        <option value="Lambaré">Lambaré</option>
                        <option value="Fernando de la Mora">Fernando de la Mora</option>
                        <option value="CDE">Ciudad del Este</option>
                        <option value="Encarnación">Encarnación</option>
                        <option value="Otra Ciudad">Otra Ciudad</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Método de Pago *</label>
                      <select 
                        value={paymentMethod}
                        onChange={e => setPaymentMethod(e.target.value as any)}
                        className="w-full bg-[#FCF8F9] border border-gray-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-[#D81B60]"
                      >
                        <option value="transferencia">Transferencia Bancaria</option>
                        <option value="giros">Giros Tigo</option>
                        <option value="contra-entrega">Pago Contra Entrega</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Dirección Exacta de Entrega *</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Calle, número, barrio, referencias"
                      value={customerAddress}
                      onChange={e => setCustomerAddress(e.target.value)}
                      className="w-full bg-[#FCF8F9] border border-gray-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-[#D81B60]"
                    />
                  </div>

                  {/* Pricing breakdown */}
                  <div className="bg-[#FCE4EC]/50 p-4 rounded-2xl space-y-2 border border-[#F4E3E7]">
                    <div className="flex justify-between text-xs text-gray-600">
                      <span>Subtotal</span>
                      <span className="font-bold tabular-nums">{formatGs(cartSubtotal)}</span>
                    </div>
                    <div className="flex justify-between text-xs text-gray-600">
                      <span>Costo de Envío</span>
                      <span className="font-bold tabular-nums">
                        {shippingCost === 0 ? '¡Gratis! 🎉' : formatGs(shippingCost)}
                      </span>
                    </div>
                    {shippingCost > 0 && (
                      <p className="text-[10px] text-[#D81B60]">
                        💡 Agregá {formatGs(300000 - cartSubtotal)} más para obtener <strong>envío gratis</strong>.
                      </p>
                    )}
                    <div className="border-t border-[#F4E3E7] pt-2 flex justify-between text-sm font-extrabold text-[#D81B60]">
                      <span>Total Final</span>
                      <span className="tabular-nums">{formatGs(cartTotal)}</span>
                    </div>
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-[#25D366] hover:bg-[#20ba5a] text-white py-4 rounded-2xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-5 h-5" /> Enviar Pedido por WhatsApp
                  </button>
                </form>

              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
