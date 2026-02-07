// 🎵 CONTROL MÚSICA AL INICIO
document.addEventListener('DOMContentLoaded', function() {
    const audio = document.getElementById('background-music');
    const musicBtn = document.getElementById('music-toggle');
    let isPlaying = false;

    // INTENTAR AUTOPLAY
    audio.volume = 0.3;
    audio.play().then(() => {
        isPlaying = true;
        musicBtn.textContent = '🔊';
    }).catch(() => {
        console.log('Autoplay bloqueado - esperando click');
    });

    // BOTÓN CONTROL MÚSICA
    musicBtn.onclick = () => {
        if (isPlaying) {
            audio.pause();
            musicBtn.textContent = '🔇';
            isPlaying = false;
        } else {
            audio.play();
            musicBtn.textContent = '🔊';
            isPlaying = true;
        }
    };

    // Reintentar autoplay en primera interacción
    document.body.onclick = () => {
        if (!isPlaying) {
            audio.play().then(() => {
                isPlaying = true;
                musicBtn.textContent = '🔊';
            }).catch(() => {});
        }
    };
});

// 🔥 PRODUCTOS
const productos = [
    { id: 1, nombre: 'Camisa Elegante', precio: 89990, img: 'images/1.png', desc: 'Camisa premium blanco/dorado' },
    { id: 2, nombre: 'Vestido Dorado', precio: 129990, img: 'images/2.png', desc: 'Vestido fashion exclusivo' },
];

let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

// ✅ FUNCIÓN CARRITO (MOVIDA ARRIBA)
function actualizarCarritoUI() {
    document.getElementById('cart-count').textContent = carrito.reduce((sum, item) => sum + (item.cantidad || 1), 0);
    
    const cartItems = document.getElementById('cart-items');
    cartItems.innerHTML = '';
    let total = 0;
    
    carrito.forEach((item, index) => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <img src="${item.img}" alt="${item.nombre}" onerror="this.src='https://via.placeholder.com/80/D4AF37/fff?text=${item.id}'">
            <div>
                <h4>${item.nombre}</h4>
                <p>${item.cantidad}x $${item.precio.toLocaleString()} = $${(item.precio * item.cantidad).toLocaleString()}</p>
            </div>
            <button onclick="removerItem(${index})" style="background:#ff4444;color:white;border:none;padding:0.5rem 1rem;border-radius:5px;cursor:pointer;font-size:0.9rem;">Eliminar</button>
        `;
        cartItems.appendChild(cartItem);
        total += item.precio * item.cantidad;
    });
    
    document.getElementById('cart-total').textContent = total.toLocaleString();
}

// ✅ CARGAR PRODUCTOS E INICIALIZAR
document.addEventListener('DOMContentLoaded', function() {
    const grid = document.getElementById('products-grid');
    productos.forEach((producto, index) => {
        const card = document.createElement('div');
        card.className = 'product-card fade-in';
        card.style.animationDelay = `${index * 0.1}s`;
        card.innerHTML = `
            <img src="${producto.img}" alt="${producto.nombre}" onerror="this.src='https://via.placeholder.com/300x250/D4AF37/fff?text=${producto.id}'" loading="lazy">
            <h3>${producto.nombre}</h3>
            <p class="price">$${producto.precio.toLocaleString()}</p>
        `;
        card.onclick = () => mostrarDetalle(producto);
        grid.appendChild(card);
    });
    actualizarCarritoUI();
});

// 🔄 NAVEGACIÓN CORREGIDA
document.getElementById('logo-home').onclick = () => {
    document.getElementById('home').scrollIntoView({ behavior: 'smooth' });
    document.getElementById('carrito-section').style.display = 'none';
    document.getElementById('catalogos').style.display = 'block';
};

document.querySelector('a[href="#catalogos"]').onclick = (e) => {
    e.preventDefault();
    document.getElementById('catalogos').scrollIntoView({ behavior: 'smooth' });
    document.getElementById('carrito-section').style.display = 'none';
    document.getElementById('catalogos').style.display = 'block';
};

// ✅ CARRITO - SIN OCULTAR PRODUCTOS
document.getElementById('cart-link').onclick = (e) => {
    e.preventDefault();
    document.getElementById('carrito-section').style.display = 'block';
    document.getElementById('carrito-section').scrollIntoView({ behavior: 'smooth' });
    actualizarCarritoUI();
};

// ✅ BOTÓN VOLVER CATÁLOGO
function volverCatalogo() {
    document.getElementById('catalogos').style.display = 'block';
    document.getElementById('carrito-section').style.display = 'none';
    document.getElementById('catalogos').scrollIntoView({ behavior: 'smooth' });
}

function mostrarDetalle(producto) {
    document.getElementById('detail-img').src = producto.img;
    document.getElementById('detail-title').textContent = producto.nombre;
    document.getElementById('detail-price').textContent = `$${producto.precio.toLocaleString()}`;
    document.getElementById('detail-desc').textContent = producto.desc;
    document.getElementById('product-detail').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    document.getElementById('btn-cart').onclick = () => agregarCarrito(producto);
}

function agregarCarrito(producto) {
    const itemExistente = carrito.find(item => item.id === producto.id);
    if (itemExistente) {
        itemExistente.cantidad = (itemExistente.cantidad || 1) + 1;
    } else {
        carrito.push({ ...producto, cantidad: 1 });
    }
    localStorage.setItem('carrito', JSON.stringify(carrito));
    actualizarCarritoUI();
    
    const img = document.getElementById('detail-img');
    const clone = img.cloneNode(true);
    clone.style.cssText = 'position:fixed;z-index:9999;width:80px;height:80px;border-radius:10px;transition:all 0.8s cubic-bezier(0.25,0.46,0.45,0.94);left:' + img.getBoundingClientRect().left + 'px;top:' + img.getBoundingClientRect().top + 'px;';
    document.body.appendChild(clone);
    setTimeout(() => {
        clone.style.left = '80%'; clone.style.top = '10%'; clone.style.opacity = '0'; clone.style.width = '40px';
    }, 100);
    setTimeout(() => clone.remove(), 900);
    
    cerrarDetalle();
}

function removerItem(index) {
    carrito.splice(index, 1);
    localStorage.setItem('carrito', JSON.stringify(carrito));
    actualizarCarritoUI();
}

document.getElementById('btn-pay').onclick = (e) => {
    e.preventDefault();
    if (carrito.length === 0) {
        alert('🛒 Carrito vacío. Agrega productos primero.');
        return;
    }
    document.getElementById('payment-form-modal').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
};

document.getElementById('customer-form').onsubmit = async (e) => {
    e.preventDefault();
    
    const datosCliente = {
        nombre: document.getElementById('customer-name').value,
        telefono: document.getElementById('customer-phone').value,
        email: document.getElementById('customer-email').value,
        direccion: document.getElementById('customer-address').value,
        cedula: document.getElementById('customer-cc').value,
        barrio: document.getElementById('customer-city').value,
        fecha: new Date().toLocaleDateString('es-CO'),
        numeroPedido: 'DYMAVI-' + Date.now().toString().slice(-6),
        whatsapp: '+1 (909) 788-5497'
    };
    
    generarPDFRecibo(datosCliente);
    
    document.getElementById('payment-form-modal').classList.add('hidden');
    carrito = [];
    localStorage.setItem('carrito', JSON.stringify(carrito));
    actualizarCarritoUI();
    document.body.style.overflow = 'auto';
    document.getElementById('carrito-section').style.display = 'none';
    document.getElementById('catalogos').style.display = 'block';
    
    alert('✅ ¡PDF descargado! Contacta WhatsApp ' + datosCliente.whatsapp + ' para pago y entrega.');
};

function generarPDFRecibo(pedido) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    const gold = [212, 175, 55];
    const white = [255, 255, 255];
    
    doc.setFillColor(...gold);
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(...white);
    doc.setFontSize(26);
    doc.setFont("helvetica", "bold");
    doc.text('DYMAVI STORE', 105, 25, { align: 'center' });
    
    doc.setFillColor(248, 249, 250);
    doc.rect(10, 45, 190, 15, 'F');
    doc.setTextColor(51, 51, 51);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text(`PEDIDO #${pedido.numeroPedido}`, 15, 55);
    
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text('CLIENTE:', 15, 72);
    doc.setFont("helvetica", "bold");
    doc.text(pedido.nombre, 15, 79);
    doc.setFont("helvetica", "normal");
    doc.text(`C.C: ${pedido.cedula}`, 15, 86);
    doc.text(`Tel: ${pedido.telefono}`, 15, 93);
    doc.text(`${pedido.direccion}, ${pedido.barrio}`, 15, 100);
    
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text('DETALLE DE COMPRA:', 15, 115);
    
    let y = 122;
    let total = 0;
    carrito.forEach(item => {
        const subtotal = item.precio * item.cantidad;
        total += subtotal;
        
        const nombreLimpio = item.nombre.replace(/[^\w\s]/gi, '').substring(0, 30);
        doc.setFont("helvetica", "bold");
        doc.text(nombreLimpio, 15, y);
        doc.setFont("helvetica", "normal");
        doc.text(`${item.cantidad} x $${Math.round(item.precio).toLocaleString('es-CO')}`, 15, y + 6);
        doc.text(`Subtotal: $${Math.round(subtotal).toLocaleString('es-CO')}`, 120, y + 6);
        y += 16;
    });
    
    doc.setFillColor(...gold);
    doc.rect(10, y + 2, 190, 15, 'F');
    doc.setTextColor(...white);
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text(`TOTAL: $${Math.round(total).toLocaleString('es-CO')} COP`, 105, y + 12, { align: 'center' });
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text('CONTACTAR PARA PAGO:', 15, y + 35);
    doc.setFontSize(18);
    doc.text(pedido.whatsapp, 15, y + 45);
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text('WhatsApp - Coordinar pago y entrega en 24h', 15, y + 52);
    
    doc.setFontSize(10);
    doc.text(`Fecha: ${pedido.fecha}`, 15, 280);
    doc.setFillColor(240, 240, 240);
    doc.rect(0, 285, 210, 15, 'F');
    doc.setTextColor(100, 100, 100);
    doc.setFont("helvetica", "bold");
    doc.text('Gracias por comprar en Dymavi Store!', 105, 292, { align: 'center' });
    
    doc.save(`Dymavi-${pedido.numeroPedido}.pdf`);
}

function cerrarDetalle() {
    document.getElementById('product-detail').classList.add('hidden');
    document.body.style.overflow = 'auto';
}

// ✅ X DEL MODAL DE PAGO FUNCIONANDO
document.querySelector('.close-detail').onclick = cerrarDetalle;
document.querySelector('.close-modal').onclick = () => {
    document.getElementById('payment-form-modal').classList.add('hidden');
    document.body.style.overflow = 'auto';
};

document.querySelector('.menu-toggle').onclick = () => {
    document.querySelector('.nav-menu').classList.toggle('active');
};

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        cerrarDetalle();
        document.getElementById('payment-form-modal').classList.add('hidden');
        document.body.style.overflow = 'auto';
    }
});
