import { useState } from 'react';
import { useDB } from '../db/index.jsx';

const CATEGORIES = {
    NUTRITION: {
        id: 'nutrition',
        title: 'Nutrition Framework',
        icon: '🥩',
        modules: [
            'La Regla Cero',
            'Estructura del Día',
            'Sistema de Medición',
            'Reglas por Comida',
            'Operación Diaria'
        ]
    },
    COOKING: {
        id: 'cooking',
        title: 'Cooking 101',
        icon: '🍳',
        modules: [
            'El Sistema Batch',
            'Batch de Proteína',
            'Batch de Carbos y Verdura',
            'Comidas sin Batch',
            'Logística Semanal'
        ]
    },
    FOOD_GUIDE: {
        id: 'food_guide',
        title: 'Food Guide',
        icon: '📋',
        modules: [
            'Regla Maestra',
            'Listas de Combustible',
            'Sustituciones Tácticas',
            'Operaciones de Campo',
            'Alcohol y The Sauce',
            'La Fórmula'
        ]
    },
    MAINTENANCE: {
        id: 'maintenance',
        title: 'Maintenance',
        icon: '⚙️',
        modules: []
    }
};

const ModReglaCero = () => (
    <div className="apex-detail-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div className="card" style={{ padding: '16px' }}>
            <h3 className="apex-card-title">LO QUE TIENES QUE ENTENDER</h3>
            <p className="apex-body">
                La comida no es placer. Es combustible. No comes para disfrutar. Comes para funcionar. 
                El sabor es un extra, no el objetivo. Un operador come para rendir. 
                Cada cosa que metes a tu cuerpo es una decisión táctica. O te acerca al objetivo o te aleja.
            </p>
            <p className="apex-body">
                Esto no es una dieta. Es tu nueva normalidad.
            </p>
        </div>
        <div className="card" style={{ padding: '16px' }}>
            <h3 className="apex-card-title">TUS NÚMEROS</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '8px', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--dim)' }}>Calorías diarias:</span> <strong style={{ color: 'var(--label)' }}>~1,950 kcal</strong>
                <span style={{ color: 'var(--dim)' }}>Proteína diaria:</span> <strong style={{ color: 'var(--alert)' }}>190 g</strong>
                <span style={{ color: 'var(--dim)' }}>Peso actual:</span> <strong style={{ color: 'var(--label)' }}>86 kg</strong>
                <span style={{ color: 'var(--dim)' }}>Peso objetivo:</span> <strong style={{ color: 'var(--label)' }}>70 kg</strong>
                <span style={{ color: 'var(--dim)' }}>Tiempo estimado:</span> <strong style={{ color: 'var(--label)' }}>5–6 meses</strong>
            </div>
        </div>
        <div className="hip-alert-banner" style={{ display: 'block', textAlign: 'center' }}>
            <div style={{ fontWeight: '800', marginBottom: '4px' }}>PROTEÍNA ES NO NEGOCIABLE</div>
            <div style={{ fontSize: '0.75rem', textTransform: 'none', color: 'var(--alert)', letterSpacing: '0' }}>
                Todo lo demás puede ajustarse. Sin proteína suficiente, no conservas músculo mientras pierdes grasa.
            </div>
        </div>
    </div>
);

const ModEstructura = () => (
    <div className="apex-detail-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div className="card" style={{ padding: '16px' }}>
            <h3 className="apex-card-title">TRES COMIDAS. SIN EXCUSAS.</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ borderLeft: '3px solid var(--alert)', paddingLeft: '12px' }}>
                    <div style={{ fontWeight: '700', color: 'var(--label)', fontSize: '0.85rem', letterSpacing: '0.05em' }}>DESAYUNO</div>
                    <div style={{ color: 'var(--dim)', fontSize: '0.85rem' }}>Proteína + grasa + fibra</div>
                </div>
                <div style={{ borderLeft: '3px solid var(--primary)', paddingLeft: '12px' }}>
                    <div style={{ fontWeight: '700', color: 'var(--label)', fontSize: '0.85rem', letterSpacing: '0.05em' }}>COMIDA</div>
                    <div style={{ color: 'var(--dim)', fontSize: '0.85rem' }}>Proteína + carbohidrato + verdura</div>
                </div>
                <div style={{ borderLeft: '3px solid var(--blue)', paddingLeft: '12px' }}>
                    <div style={{ fontWeight: '700', color: 'var(--label)', fontSize: '0.85rem', letterSpacing: '0.05em' }}>CENA</div>
                    <div style={{ color: 'var(--dim)', fontSize: '0.85rem' }}>Proteína + verdura + carbos (mínimo)</div>
                </div>
                <div style={{ borderLeft: '3px solid var(--dim)', paddingLeft: '12px' }}>
                    <div style={{ fontWeight: '700', color: 'var(--label)', fontSize: '0.85rem', letterSpacing: '0.05em' }}>SNACK</div>
                    <div style={{ color: 'var(--dim)', fontSize: '0.85rem' }}>Fruta + opcional yogurt (sin grasa)</div>
                </div>
            </div>
        </div>
        
        <div className="card" style={{ padding: '16px' }}>
            <p className="apex-body">
                <strong style={{ color: 'var(--warn)' }}>Grasas:</strong> Solo en el desayuno (huevo entero) o en UNA SOLA comida. El resto es proteína limpia, carbohidratos y verdura. Sin aceite extra, sin queso, sin salsas.
            </p>
            <p className="apex-body">
                <strong style={{ color: 'var(--primary)' }}>Carbohidratos:</strong> Van en la comida. Tu cuerpo los usa durante el día, en la noche los guarda.
            </p>
        </div>
    </div>
);

const ModMedicion = () => (
    <div className="apex-detail-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <p className="apex-body" style={{ textAlign: 'center', fontStyle: 'italic' }}>
            Sin báscula. Sin contar calorías.<br/>Mides con tus manos.
        </p>

        <div className="card" style={{ padding: '16px' }}>
            <h3 className="apex-card-title" style={{ color: 'var(--alert)' }}>PROTEÍNA = PALMA DE TU MANO</h3>
            <p className="apex-body">
                Tamaño y grosor de tu palma abierta (sin dedos). 
                <strong style={{ color: 'var(--label)' }}> 1-2 palmas por comida principal.</strong>
            </p>
            <div style={{ background: 'rgba(255, 85, 0, 0.1)', padding: '12px', borderRadius: '4px', fontSize: '0.85rem', color: 'var(--alert)', textAlign: 'center', fontWeight: '600' }}>
                2 palmas = ~40–50g<br/>3 comidas = ~120–150g<br/>+ snacks = ~190g diario
            </div>
        </div>

        <div className="card" style={{ padding: '16px' }}>
            <h3 className="apex-card-title" style={{ color: 'var(--primary)' }}>VERDURAS = DOS MANOS JUNTAS</h3>
            <p className="apex-body">
                Todo lo que puedas de verduras verdes (brócoli, ejotes, calabaza, chayote). Sin límite.
            </p>
        </div>

        <div className="card" style={{ padding: '16px' }}>
            <h3 className="apex-card-title" style={{ color: 'var(--blue)' }}>CARBOS = TU PUÑO CERRADO</h3>
            <p className="apex-body">
                Solo en la comida del mediodía. Un puño de arroz o papa cocida.
            </p>
        </div>

        <div className="card" style={{ padding: '16px' }}>
            <h3 className="apex-card-title" style={{ color: 'var(--warn)' }}>GRASAS = TU PULGAR</h3>
            <p className="apex-body">
                Ya las tienes en el desayuno (huevo). No añadas más.
            </p>
        </div>
    </div>
);

const ModReglas = () => (
    <div className="apex-detail-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div className="card" style={{ padding: '16px' }}>
            <h3 className="apex-card-title">DESAYUNO (Rápido)</h3>
            <ul className="apex-list">
                <li><strong style={{ color: 'var(--label)' }}>Huevos:</strong> 3–4 (revueltos, cocidos, estrellados).</li>
                <li><strong style={{ color: 'var(--label)' }}>Leguminosa:</strong> Frijoles negros, lentejas o garbanzos (escurridos).</li>
                <li><strong style={{ color: 'var(--label)' }}>Verdura:</strong> Espinaca, jitomate, chile.</li>
            </ul>
        </div>

        <div className="card" style={{ padding: '16px' }}>
            <h3 className="apex-card-title" style={{ color: 'var(--primary)' }}>COMIDA (El Ancla del Día)</h3>
            <p style={{ color: 'var(--warn)', fontSize: '0.8rem', fontStyle: 'italic', marginBottom: '12px' }}>
                Cocinas en batch. Calientas en micro sin aceite.
            </p>
            <ul className="apex-list">
                <li><strong style={{ color: 'var(--label)' }}>Proteína (2 palmas):</strong> Pollo, carne molida magra o pescado.</li>
                <li><strong style={{ color: 'var(--label)' }}>Carbo (1 puño):</strong> Arroz, papa o camote cocido.</li>
                <li><strong style={{ color: 'var(--label)' }}>Verdura (2 manos):</strong> Mezcla congelada, brócoli, calabaza.</li>
            </ul>
        </div>

        <div className="card" style={{ padding: '16px' }}>
            <h3 className="apex-card-title" style={{ color: 'var(--blue)' }}>CENA (Min Carbos)</h3>
            <ul className="apex-list">
                <li><strong style={{ color: 'var(--label)' }}>Proteína:</strong> Pollo/carne (batch), pescado, huevo, pavo o atún en agua.</li>
                <li><strong style={{ color: 'var(--label)' }}>Carbo (opcional):</strong> 2 tortillas maíz o tostadas horneadas.</li>
                <li>Siempre con verdura extra para llenar.</li>
            </ul>
        </div>

        <div className="card" style={{ padding: '16px' }}>
            <h3 className="apex-card-title">SNACK (Combustible)</h3>
            <p className="apex-body">
                1 plátano + 1 manzana.<br/>
                Opcional: Yogurt natural sin grasa.<br/>
                Antojo fuerte: Solo 1 cucharada de miel.
            </p>
        </div>
    </div>
);

const ModOperacion = () => (
    <div className="apex-detail-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="card" style={{ padding: '16px', textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>💧</div>
                <div style={{ fontWeight: '700', color: 'var(--blue)', fontSize: '0.9rem' }}>3 LITROS</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--dim)', marginTop: '4px', lineHeight: '1.4' }}>
                    Agua de limón c/sal.<br/>Cero refresco o jugos.
                </div>
            </div>
            <div className="card" style={{ padding: '16px', textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>💊</div>
                <div style={{ fontWeight: '700', color: 'var(--primary)', fontSize: '0.9rem' }}>VITAMINAS</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--dim)', marginTop: '4px', lineHeight: '1.4' }}>
                    Multivitamínico básico diario en desayuno.
                </div>
            </div>
        </div>

        <div className="hip-alert-banner" style={{ display: 'block', textAlign: 'center' }}>
            <div style={{ fontWeight: '800', marginBottom: '4px' }}>CERO ALCOHOL</div>
            <div style={{ fontSize: '0.75rem', textTransform: 'none', color: 'var(--alert)', letterSpacing: '0' }}>
                30 días. Sin excepciones.
            </div>
        </div>

        <div className="card" style={{ padding: '16px' }}>
            <h3 className="apex-card-title" style={{ color: 'var(--warn)' }}>PRIORIDADES DE COMPRA</h3>
            <ol className="apex-list">
                <li>Huevos, frijoles, verdura congelada</li>
                <li>Pollo o carne molida magra</li>
                <li>Arroz o papa</li>
                <li>Plátano y manzana</li>
                <li>Yogurt sin grasa, tortillas de maíz</li>
            </ol>
        </div>

        <div className="card" style={{ padding: '16px', border: '1px solid var(--alert)' }}>
            <h3 className="apex-card-title" style={{ color: 'var(--alert)' }}>ELIMINAR DE TU CASA</h3>
            <p className="apex-body">
                Frituras, galletas, pan dulce, pastel, refrescos, jugos, helado, cátsup/mayonesa, cereales azucarados.
            </p>
            <p className="apex-body" style={{ color: 'var(--alert)', fontStyle: 'italic' }}>
                La disciplina empieza en el súper.
            </p>
        </div>

        <div className="card" style={{ padding: '16px' }}>
            <h3 className="apex-card-title">RESUMEN OPERATIVO</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '12px', fontSize: '0.85rem', color: 'var(--dim)', lineHeight: '1.4' }}>
                <strong style={{ color: 'var(--label)' }}>DESPERTAR:</strong> <span>Agua + Movilidad (15m)</span>
                <strong style={{ color: 'var(--label)' }}>DESAYUNO:</strong> <span>Huevos + frijoles + verdura</span>
                <strong style={{ color: 'var(--label)' }}>COMIDA:</strong> <span>Proteína batch + carbo + verdura</span>
                <strong style={{ color: 'var(--label)' }}>SNACK:</strong> <span>Fruta + yogurt</span>
                <strong style={{ color: 'var(--label)' }}>CENA:</strong> <span>Proteína + verdura + min carbo</span>
                <strong style={{ color: 'var(--label)' }}>NOCHE:</strong> <span>Sin comida 2 hrs antes de dormir</span>
            </div>
        </div>
    </div>
);

const ModSistemaBatch = () => (
    <div className="apex-detail-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div className="card" style={{ padding: '16px' }}>
            <h3 className="apex-card-title">LO QUE NECESITAS ENTENDER</h3>
            <p className="apex-body">
                No estás aprendiendo a cocinar. Estás aprendiendo a preparar combustible.
            </p>
            <p className="apex-body">
                Simple, rápido, repetible. No buscas sabor elaborado. Buscas comida lista, limpia y que dure. El objetivo es cocinar una vez y resolver varios días.
            </p>
        </div>

        <div className="card" style={{ padding: '16px' }}>
            <h3 className="apex-card-title" style={{ color: 'var(--primary)' }}>SISTEMA DE CONTENEDORES</h3>
            <p className="apex-body" style={{ marginBottom: '8px' }}>
                3–4 contenedores de plástico o vidrio con tapa (tamaño mediano).
            </p>
            <ul className="apex-list">
                <li><strong style={{ color: 'var(--label)' }}>1 para proteína</strong></li>
                <li><strong style={{ color: 'var(--label)' }}>1 para carbohidrato</strong></li>
                <li><strong style={{ color: 'var(--label)' }}>1 para verdura</strong></li>
            </ul>
            <p className="apex-body" style={{ marginTop: '12px' }}>
                Cada macronutriente vive separado. Calientas por separado. Los combinas en el plato al momento de comer. Así controlas porciones sin pensar.
            </p>
        </div>

        <div className="card" style={{ padding: '16px' }}>
            <h3 className="apex-card-title">EQUIPO MÍNIMO</h3>
            <ul className="apex-list">
                <li>Sartén antiadherente</li>
                <li>Olla mediana con tapa</li>
                <li>Tabla para picar / Plato grande</li>
                <li>Cuchillo</li>
                <li>Espátula o cuchara de madera</li>
                <li>Microondas</li>
            </ul>
        </div>
    </div>
);

const ModBatchProteina = () => (
    <div className="apex-detail-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div className="card" style={{ padding: '16px' }}>
            <h3 className="apex-card-title">POLLO EN BATCH</h3>
            <p className="apex-body" style={{ color: 'var(--primary)', fontWeight: 'bold', marginBottom: '4px' }}>Ingredientes (4-5 días):</p>
            <p className="apex-body">1 kg pechuga, Sal, Pimienta, Ajo polvo.</p>
            
            <p className="apex-body" style={{ color: 'var(--primary)', fontWeight: 'bold', marginTop: '12px', marginBottom: '4px' }}>Preparación (Sartén):</p>
            <ol className="apex-list" style={{ paddingLeft: '20px' }}>
                <li>Corta pechugas en trozos.</li>
                <li>Sartén fuego medio. Sin/poco aceite.</li>
                <li>Sazona por ambos lados. Tapa la sartén.</li>
                <li>Cocina 6–8 min por lado. Verifica que esté blanco por dentro.</li>
                <li>Enfría 10 min. Guarda en contenedor.</li>
            </ol>

            <div style={{ background: 'rgba(0, 255, 102, 0.05)', padding: '12px', borderRadius: '4px', marginTop: '12px' }}>
                <p className="apex-body" style={{ margin: 0 }}>
                    <strong style={{ color: 'var(--primary)' }}>Cómo comerlo:</strong> Calienta 1-2 min. <br/>
                    <strong style={{ color: 'var(--label)' }}>Medición:</strong> 1-2 palmas = tu porción.
                </p>
            </div>
        </div>

        <div className="card" style={{ padding: '16px' }}>
            <h3 className="apex-card-title">CARNE MOLIDA EN BATCH</h3>
            <p className="apex-body" style={{ color: 'var(--primary)', fontWeight: 'bold', marginBottom: '4px' }}>Ingredientes (4-5 días):</p>
            <p className="apex-body">1 kg carne molida magra, Sal, Pimienta, Ajo/Cebolla polvo, Comino.</p>
            
            <p className="apex-body" style={{ color: 'var(--primary)', fontWeight: 'bold', marginTop: '12px', marginBottom: '4px' }}>Preparación:</p>
            <ol className="apex-list" style={{ paddingLeft: '20px' }}>
                <li>Sartén fuego medio-alto. Sin aceite (suelta grasa).</li>
                <li>Agrega carne y rompe grumos.</li>
                <li>Cuando no veas rosa (5–7 min), sazona. Mezcla 3 min más.</li>
                <li>Retira exceso de grasa si es necesario. Enfría y guarda.</li>
            </ol>

            <div style={{ background: 'rgba(0, 255, 102, 0.05)', padding: '12px', borderRadius: '4px', marginTop: '12px' }}>
                <p className="apex-body" style={{ margin: 0 }}>
                    <strong style={{ color: 'var(--primary)' }}>Cómo comerlo:</strong> Calienta en microondas.<br/>
                    <strong style={{ color: 'var(--label)' }}>Medición:</strong> 2 palmas = tu porción.
                </p>
            </div>
        </div>

        <div className="card" style={{ padding: '16px', borderLeft: '3px solid var(--blue)' }}>
            <h3 className="apex-card-title" style={{ color: 'var(--blue)' }}>PESCADO (Sin Batch)</h3>
            <p className="apex-body" style={{ fontStyle: 'italic', marginBottom: '12px' }}>Tarda 10 min. Se hace al momento.</p>
            <ul className="apex-list" style={{ marginBottom: '12px' }}>
                <li>Descongela filetes. Seca con papel. Sazona.</li>
                <li>Sartén fuego medio-alto. Sin/poco aceite.</li>
                <li>3-4 min por lado. Exprime limón.</li>
            </ul>
            <p className="apex-body" style={{ color: 'var(--warn)', fontWeight: 'bold', margin: 0 }}>No guardes cocinado más de 1 día.</p>
        </div>
    </div>
);

const ModBatchCarbos = () => (
    <div className="apex-detail-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div className="card" style={{ padding: '16px' }}>
            <h3 className="apex-card-title">ARROZ BLANCO</h3>
            <p className="apex-body" style={{ color: 'var(--label)', fontWeight: 'bold', marginBottom: '4px' }}>1 taza arroz + 2 tazas agua + Sal</p>
            <ol className="apex-list" style={{ paddingLeft: '20px' }}>
                <li>Enjuaga arroz bajo agua fría.</li>
                <li>Olla con agua y sal. Fuego alto hasta hervir.</li>
                <li>Al hervir, fuego mínimo. Tapa 15–18 min (sin abrir).</li>
                <li>Apaga. Reposa 5 min. Esponja con tenedor. Enfría y guarda.</li>
            </ol>
            <p className="apex-body" style={{ color: 'var(--primary)', marginTop: '12px', fontWeight: 'bold', margin: '12px 0 0 0' }}>Medición: 1 puño cerrado = tu porción.</p>
        </div>

        <div className="card" style={{ padding: '16px' }}>
            <h3 className="apex-card-title">PAPA O CAMOTE</h3>
            <p className="apex-body" style={{ color: 'var(--label)', fontWeight: 'bold', marginBottom: '4px' }}>4-6 papas o 2-3 camotes + Agua + Sal</p>
            <ol className="apex-list" style={{ paddingLeft: '20px' }}>
                <li>Lava bien y corta en cubos medianos.</li>
                <li>Hierve 15-20 min hasta que entre un tenedor.</li>
                <li>Escurre. Enfría y guarda.</li>
            </ol>
            <p className="apex-body" style={{ color: 'var(--primary)', marginTop: '12px', fontWeight: 'bold', margin: '12px 0 0 0' }}>Medición: 1 puño cerrado = tu porción.</p>
        </div>

        <div className="card" style={{ padding: '16px' }}>
            <h3 className="apex-card-title" style={{ color: 'var(--primary)' }}>VERDURA CONGELADA</h3>
            <p className="apex-body" style={{ fontStyle: 'italic', marginBottom: '12px' }}>El paso que más gente se salta. No lo saltes.</p>
            <ol className="apex-list" style={{ paddingLeft: '20px' }}>
                <li>Agua a hervir en olla.</li>
                <li>Agrega 1-2 bolsas de verduras (directo, sin descongelar).</li>
                <li><strong>3-5 minutos máximo.</strong> Quieres que queden firmes.</li>
                <li>Escurre, sazona (ajo/sal), enfría y guarda.</li>
            </ol>
            <p className="apex-body" style={{ color: 'var(--alert)', marginTop: '12px', fontWeight: 'bold', margin: '12px 0 0 0' }}>No añadas aceite ni mantequilla.</p>
        </div>
    </div>
);

const ModSinBatch = () => (
    <div className="apex-detail-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div className="card" style={{ padding: '16px' }}>
            <h3 className="apex-card-title">DESAYUNO (Rápido)</h3>
            <p className="apex-body" style={{ fontStyle: 'italic', marginBottom: '12px' }}>Base: Huevos + Leguminosa lata + Verdura batch</p>
            <ul className="apex-list">
                <li><strong style={{ color: 'var(--label)' }}>Huevos:</strong> Revueltos (2-3 min), Estrellados tapados (2-3 min) o Cocidos (8-10 min).</li>
                <li><strong style={{ color: 'var(--label)' }}>Leguminosa:</strong> Lata de frijoles/lentejas. Escurre, enjuaga, calienta 1 min.</li>
                <li><strong style={{ color: 'var(--label)' }}>Verdura:</strong> Saca del contenedor batch. Calienta 1 min.</li>
            </ul>
        </div>

        <div className="card" style={{ padding: '16px' }}>
            <h3 className="apex-card-title">CENAS RÁPIDAS</h3>
            <ul className="apex-list">
                <li><strong style={{ color: 'var(--label)' }}>Opción A:</strong> Huevos (otra vez) + frijoles + verdura.</li>
                <li><strong style={{ color: 'var(--label)' }}>Opción B:</strong> Fiambre de pavo (sin mayo/queso) en tortilla de maíz o con verdura.</li>
                <li><strong style={{ color: 'var(--label)' }}>Opción C:</strong> Atún/sardinas en agua (escurrir). Máx 2 veces/sem.</li>
            </ul>
            <p className="apex-body" style={{ color: 'var(--primary)', marginTop: '12px', fontWeight: 'bold', margin: '12px 0 0 0' }}>Siempre con verdura encima para llenar el plato.</p>
        </div>

        <div className="card" style={{ padding: '16px' }}>
            <h3 className="apex-card-title">SNACK (Ensamblaje)</h3>
            <p className="apex-body">1 plátano + 1 manzana.</p>
            <p className="apex-body">Yogurt natural sin grasa (opcional).</p>
            <p className="apex-body">1 cucharada de miel (solo antojo fuerte).</p>
        </div>

        <div className="card" style={{ padding: '16px' }}>
            <h3 className="apex-card-title">CONDIMENTOS</h3>
            <p className="apex-body"><strong style={{ color: 'var(--primary)' }}>Permitidos:</strong> Sal, Pimienta, Ajo, Comino, Orégano, Chile polvo, Limón (sin límite), Salsa picante (poco).</p>
            <p className="apex-body" style={{ marginTop: '8px' }}><strong style={{ color: 'var(--alert)' }}>Prohibidos:</strong> Mantequilla, Crema, Queso, Mayonesa, Aderezos botella, Cátsup, Consomé muy salado.</p>
        </div>
    </div>
);

const ModLogistica = () => (
    <div className="apex-detail-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div className="card" style={{ padding: '16px' }}>
            <h3 className="apex-card-title">DÍA TIPO BATCH COOKING</h3>
            <p className="apex-body" style={{ fontStyle: 'italic', marginBottom: '12px' }}>Una vez. 35-45 min. Resuelto.</p>
            <ol className="apex-list" style={{ paddingLeft: '20px' }}>
                <li>Pon agua para carbohidratos (15-20 min).</li>
                <li>Mientras hierve, sazona y cocina proteína (20-25 min).</li>
                <li>Mientras se cocina proteína, hierve verdura (5 min).</li>
                <li>Escurre verdura. Revisa proteína.</li>
                <li>Enfría todo antes de meter a contenedores y refrigera.</li>
            </ol>
        </div>

        <div className="card" style={{ padding: '16px' }}>
            <h3 className="apex-card-title">ALMACENAMIENTO</h3>
            <ul className="apex-list">
                <li><strong style={{ color: 'var(--label)' }}>Proteína/Carbos:</strong> 4-5 días (refri).</li>
                <li><strong style={{ color: 'var(--label)' }}>Verdura cocida:</strong> 3-4 días.</li>
                <li><strong style={{ color: 'var(--label)' }}>Pescado cocido:</strong> 1 día máximo.</li>
                <li><strong style={{ color: 'var(--label)' }}>Latas abiertas:</strong> Pasa a recipiente. No guardes en lata.</li>
            </ul>
        </div>

        <div className="card" style={{ padding: '16px', borderLeft: '3px solid var(--warn)' }}>
            <h3 className="apex-card-title" style={{ color: 'var(--warn)' }}>LISTA DE COMPRA BASE</h3>
            <p className="apex-body" style={{ fontWeight: 'bold', marginBottom: '8px' }}>Objetivo: 500-600 MXN / sem</p>
            <ul className="apex-list">
                <li>1 kg pollo / carne molida magra</li>
                <li>1 kg arroz blanco o papas</li>
                <li>2x Bolsas verdura congelada + frescas</li>
                <li>2-3x Latas frijoles negros</li>
                <li>Cartón de huevos (12-18)</li>
                <li>6-7 Plátanos y manzanas</li>
                <li>Yogurt natural, tortillas maíz, filetes pescado.</li>
            </ul>
        </div>
    </div>
);

const ModReglaMaestra = () => (
    <div className="apex-detail-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div style={{ textAlign: 'center', margin: '16px 0 8px 0' }}>
            <h2 style={{ 
                fontSize: '1.8rem', 
                fontWeight: '900', 
                color: 'var(--primary)', 
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                borderBottom: '2px solid var(--primary)',
                display: 'inline-block',
                paddingBottom: '8px',
                marginBottom: '12px',
                textShadow: '0 0 15px rgba(0, 255, 102, 0.4)'
            }}>
                LA REGLA MAESTRA
            </h2>
        </div>

        <div style={{
            background: 'linear-gradient(180deg, rgba(0,255,102,0.1) 0%, rgba(0,0,0,0) 100%)',
            border: '1px solid rgba(0,255,102,0.2)',
            borderRadius: '12px',
            padding: '24px',
            textAlign: 'center',
            boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
        }}>
            <p style={{ fontSize: '1.2rem', color: 'var(--label)', fontWeight: '700', lineHeight: '1.5', margin: '0 0 16px 0' }}>
                Si Leonidas en su última comida antes de ir a la guerra con los otros 299 espartanos no lo comería, <span style={{ color: 'var(--alert)' }}>tú tampoco.</span>
            </p>
            <p style={{ fontSize: '0.95rem', color: 'var(--dim)', fontStyle: 'italic', margin: 0 }}>
                Si un niño de 7 años se puede hacer adicto a eso y sus papás no lo dejarían comerlo a menudo, es comida para niños.
            </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '0 4px' }}>
            <p style={{ fontSize: '1rem', color: 'var(--label)', lineHeight: '1.6', textAlign: 'justify', margin: 0 }}>
                Un <strong style={{ color: 'var(--primary)' }}>motor V12</strong> necesita combustible premium. ¿Va a ser rápido aunque tenga combustible malo? Sí, probablemente. Pero su capacidad máxima va a estar limitada, no por el motor, sino porque el combustible no tiene la calidad que necesita para rendir al máximo.
            </p>
            
            <div style={{ borderLeft: '4px solid var(--label)', paddingLeft: '16px', margin: '8px 0' }}>
                <p style={{ fontSize: '1.05rem', color: 'var(--label)', fontWeight: '600', lineHeight: '1.4', margin: 0, fontStyle: 'italic' }}>
                    Un Aston Martin DBS 5.2 V12 Biturbo nunca va a mostrar su verdadero poder si lo alimentas como si fuera un Tsuru.
                </p>
            </div>

            <p style={{ fontSize: '0.95rem', color: 'var(--dim)', lineHeight: '1.6', textAlign: 'justify', margin: 0 }}>
                Piensa a largo plazo. Imagina que dos personas tienen cada uno un Nissan GT-R 1998 que fue usado en <em>Fast & Furious</em> por Brian O'Conner. Pero un vato no le dio mantenimiento adecuado a su coche, mientras que el otro sí. ¿Cuál quieres ser?
            </p>

            <p style={{ fontSize: '0.95rem', color: 'var(--dim)', lineHeight: '1.6', textAlign: 'justify', margin: 0 }}>
                Puedes seguir funcionando con mierda en el tanque. Puedes seguir moviéndote. Pero llega un punto en que el cuerpo ya no responde. <span style={{ color: 'var(--alert)', fontWeight: '600' }}>El primer límite es físico. El segundo, moral y legal.</span>
            </p>
        </div>

        <div style={{ 
            marginTop: '24px', 
            padding: '24px', 
            background: 'var(--panel)', 
            borderTop: '2px solid var(--alert)',
            textAlign: 'center',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
        }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '900', color: 'var(--label)', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>
                El motor no miente.
            </h3>
            <p style={{ fontSize: '1.2rem', color: 'var(--primary)', fontWeight: '700', marginTop: '8px', marginBottom: 0, textShadow: '0 0 10px rgba(0,255,102,0.3)' }}>
                Escúchalo.
            </p>
        </div>
    </div>
);

const ModListasCombustible = () => (
    <div className="apex-detail-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div className="card" style={{ padding: '16px', borderLeft: '3px solid var(--primary)' }}>
            <h3 className="apex-card-title" style={{ color: 'var(--primary)' }}>LISTA VERDE (COME ESTO)</h3>
            
            <p className="apex-body" style={{ fontWeight: 'bold', color: 'var(--label)', marginTop: '8px', marginBottom: '4px' }}>Proteínas</p>
            <ul className="apex-list">
                <li>Pechuga de pollo, carne molida magra</li>
                <li>Pescado (tilapia/mojarra), atún/sardinas en agua</li>
                <li>Huevo entero, claras</li>
                <li>Fiambre de pavo sin grasa</li>
                <li>Frijoles negros/bayos, lentejas, garbanzos</li>
            </ul>

            <p className="apex-body" style={{ fontWeight: 'bold', color: 'var(--label)', marginTop: '12px', marginBottom: '4px' }}>Carbohidratos & Verduras</p>
            <ul className="apex-list">
                <li>Arroz blanco, papa, camote cocidos</li>
                <li>Tortillas maíz (máx 2 por comida)</li>
                <li>Avena (medida con puño), fruta entera</li>
                <li><strong>Sin límite:</strong> Brócoli, espinaca, ejotes, calabaza, verduras verdes.</li>
            </ul>

            <p className="apex-body" style={{ fontWeight: 'bold', color: 'var(--label)', marginTop: '12px', marginBottom: '4px' }}>Grasas & Bebidas</p>
            <ul className="apex-list">
                <li>Yema de huevo, aguacate (máx 1/4)</li>
                <li>Agua, agua limón/café/té sin azúcar</li>
            </ul>
        </div>

        <div className="card" style={{ padding: '16px', borderLeft: '3px solid var(--alert)' }}>
            <h3 className="apex-card-title" style={{ color: 'var(--alert)' }}>LISTA ROJA (NO COMES ESTO)</h3>
            
            <p className="apex-body" style={{ fontWeight: 'bold', color: 'var(--label)', marginTop: '8px', marginBottom: '4px' }}>Azúcares & Procesados</p>
            <ul className="apex-list">
                <li>Refrescos, jugos botella, energéticas</li>
                <li>Galletas, pan dulce, pastel, helado, cereales</li>
                <li>Yogurt con azúcar/fruta, granola comercial</li>
            </ul>

            <p className="apex-body" style={{ fontWeight: 'bold', color: 'var(--label)', marginTop: '12px', marginBottom: '4px' }}>Chatarra & Grasas Malas</p>
            <ul className="apex-list">
                <li>Frituras, fast food, pizza, instant noodles</li>
                <li>Chingo de queso, nuggets, salchichas</li>
                <li>Mantequilla, crema, mayonesa</li>
                <li>Salsas/aderezos botella, cátsup</li>
            </ul>
        </div>

        <div className="card" style={{ padding: '16px' }}>
            <h3 className="apex-card-title" style={{ color: 'var(--blue)' }}>LA REGLA DE LA FRUTA</h3>
            <p className="apex-body">
                Una o dos piezas al día. <strong>Enteras, no licuadas.</strong> La fibra frena la absorción de azúcar.
            </p>
            <ul className="apex-list" style={{ marginTop: '8px' }}>
                <li><strong style={{ color: 'var(--primary)' }}>Seguras:</strong> Manzana, plátano, naranja, fresas, sandía.</li>
                <li><strong style={{ color: 'var(--warn)' }}>Con cuidado:</strong> Mango, uvas, plátano macho, piña.</li>
            </ul>
        </div>
    </div>
);

const ModSustituciones = () => (
    <div className="apex-detail-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <p className="apex-body" style={{ fontStyle: 'italic', marginBottom: '8px', textAlign: 'center' }}>En vez de eso, come esto.</p>
        
        <div className="card" style={{ padding: '12px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', alignItems: 'center' }}>
            <span style={{ color: 'var(--alert)', fontSize: '0.9rem' }}>Refresco / Energéticas</span>
            <span style={{ color: 'var(--primary)', fontSize: '0.9rem', fontWeight: 'bold' }}>Agua mineral / Café negro</span>
        </div>
        <div className="card" style={{ padding: '12px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', alignItems: 'center' }}>
            <span style={{ color: 'var(--alert)', fontSize: '0.9rem' }}>Jugo de naranja</span>
            <span style={{ color: 'var(--primary)', fontSize: '0.9rem', fontWeight: 'bold' }}>Naranja entera</span>
        </div>
        <div className="card" style={{ padding: '12px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', alignItems: 'center' }}>
            <span style={{ color: 'var(--alert)', fontSize: '0.9rem' }}>Pan blanco</span>
            <span style={{ color: 'var(--primary)', fontSize: '0.9rem', fontWeight: 'bold' }}>2 Tortillas de maíz</span>
        </div>
        <div className="card" style={{ padding: '12px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', alignItems: 'center' }}>
            <span style={{ color: 'var(--alert)', fontSize: '0.9rem' }}>Papas fritas</span>
            <span style={{ color: 'var(--primary)', fontSize: '0.9rem', fontWeight: 'bold' }}>Papa cocida con limón</span>
        </div>
        <div className="card" style={{ padding: '12px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', alignItems: 'center' }}>
            <span style={{ color: 'var(--alert)', fontSize: '0.9rem' }}>Mayonesa / Crema</span>
            <span style={{ color: 'var(--primary)', fontSize: '0.9rem', fontWeight: 'bold' }}>Aguacate / Limón+Sal</span>
        </div>
        <div className="card" style={{ padding: '12px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', alignItems: 'center' }}>
            <span style={{ color: 'var(--alert)', fontSize: '0.9rem' }}>Galletas / Helado</span>
            <span style={{ color: 'var(--primary)', fontSize: '0.9rem', fontWeight: 'bold' }}>Manzana+Miel / Yogurt+Plátano</span>
        </div>
        <div className="card" style={{ padding: '12px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', alignItems: 'center' }}>
            <span style={{ color: 'var(--alert)', fontSize: '0.9rem' }}>Pizza</span>
            <span style={{ color: 'var(--primary)', fontSize: '0.9rem', fontWeight: 'bold' }}>Pollo, arroz, verdura</span>
        </div>
    </div>
);

const ModOperacionesCampo = () => (
    <div className="apex-detail-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <p className="apex-body" style={{ fontStyle: 'italic', textAlign: 'center' }}>Comer fuera no arruina el protocolo. Tomar malas decisiones sí.</p>
        
        <div className="card" style={{ padding: '16px' }}>
            <h3 className="apex-card-title">ANTES DE PEDIR</h3>
            <ul className="apex-list">
                <li>Busca proteína grillada, al vapor o asada.</li>
                <li>Busca verdura como guarnición.</li>
                <li>Verifica si puedes sustituir fritas por ensalada/arroz.</li>
            </ul>
        </div>

        <div className="card" style={{ padding: '16px' }}>
            <h3 className="apex-card-title" style={{ color: 'var(--primary)' }}>LO QUE PIDES</h3>
            <ul className="apex-list">
                <li>Pollo a la plancha o carne asada magra.</li>
                <li>Pescado al vapor o asado.</li>
                <li>Ensalada sin aderezo o con limón.</li>
                <li>Arroz blanco de guarnición o sopa de verduras.</li>
            </ul>
        </div>

        <div className="card" style={{ padding: '16px' }}>
            <h3 className="apex-card-title" style={{ color: 'var(--warn)' }}>CÓMO MODIFICAS</h3>
            <ul className="apex-list">
                <li><strong style={{ color: 'var(--label)' }}>"Sin crema", "Sin queso", "Sin mantequilla".</strong></li>
                <li><strong style={{ color: 'var(--label)' }}>"La salsa aparte".</strong></li>
                <li>Evita todo lo "empanizado", "cremoso", "gratinado" o "especial de la casa".</li>
            </ul>
        </div>

        <div className="card" style={{ padding: '16px' }}>
            <h3 className="apex-card-title">TAQUERÍAS</h3>
            <p className="apex-body" style={{ marginBottom: '8px' }}>El peligro no es el taco, es lo que le ponen encima.</p>
            <ul className="apex-list">
                <li><strong style={{ color: 'var(--primary)' }}>Permitido:</strong> Carne asada magra, tortilla maíz, salsa verde/roja, cilantro, limón. Guacamole (poco).</li>
                <li><strong style={{ color: 'var(--alert)' }}>Prohibido:</strong> Queso, crema, chicharrón, tortilla harina, refresco.</li>
            </ul>
            <div style={{
                background: 'rgba(0, 0, 0, 0.15)', borderLeft: '3px solid var(--warn)', padding: '12px 16px', marginTop: '16px', borderRadius: '0 4px 4px 0', fontStyle: 'italic', fontSize: '0.9rem', color: 'var(--label)', lineHeight: '1.5'
            }}>
                El taco de carne asada limpio con tortilla de maíz, salsa y limón no te mata. El taco bañado en crema, queso y acompañado de refresco sí.
            </div>
        </div>
    </div>
);

const ModAlcohol = () => (
    <div className="apex-detail-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div className="hip-alert-banner" style={{ display: 'block', textAlign: 'center' }}>
            <div style={{ fontWeight: '800', marginBottom: '4px' }}>CERO ALCOHOL LOS PRIMEROS 30 DÍAS</div>
            <div style={{ fontSize: '0.75rem', textTransform: 'none', color: 'var(--alert)', letterSpacing: '0' }}>
                Sin negociación. Sin excepción.
            </div>
        </div>

        <div className="card" style={{ padding: '16px' }}>
            <h3 className="apex-card-title">DESPUÉS DE 30 DÍAS</h3>
            <ul className="apex-list">
                <li><strong style={{ color: 'var(--label)' }}>Ocasionalmente:</strong> Vodka, tequila, mezcal solo (máx 2). Vino (1-2 copas). Agua mineral/tónica sin azúcar.</li>
                <li><strong style={{ color: 'var(--alert)' }}>Nunca:</strong> Cerveza, cocteles dulces, bebidas preparadas (New Mix), destilados oscuros con refresco.</li>
            </ul>
        </div>

        <div className="card" style={{ padding: '16px' }}>
            <h3 className="apex-card-title" style={{ color: 'var(--alert)' }}>BIOQUÍMICA</h3>
            <p className="apex-body">
                Tu hígado procesa alcohol antes que nada. Mientras lo procesa, no quema grasa, no recupera músculo, ni regula hormonas. 
                Una noche frena hasta 48-72h de progreso. Baja testosterona y arruina el sueño.
            </p>
        </div>

        <div className="card" style={{ padding: '16px', borderLeft: '3px solid var(--blue)' }}>
            <h3 className="apex-card-title" style={{ color: 'var(--blue)' }}>THE SAUCE</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <p className="apex-body">
                    Mira, me da igual si quieres tomar. Adelante. No hay problema en que los atletas busquen formas de relajarse. Tienes que lidiar con el estrés, lo entiendo. Y si te obligo a dejarlo, después me vas a echar la culpa de haberte quitado lo que te funciona. Así que si lo necesitas, tómalo.
                </p>
                <div style={{
                    background: 'rgba(0, 0, 0, 0.15)', borderLeft: '3px solid var(--blue)', padding: '12px 16px', borderRadius: '0 4px 4px 0', fontStyle: 'italic', color: 'var(--label)'
                }}>
                    Si ese trago es lo que saca tu "lado oscuro" y te mete en la zona, está bien… siempre y cuando tú sigas controlando. La regla es simple: controla tu lado oscuro. No dejes que él te controle a ti.
                </div>
                <p className="apex-body">
                    ¿Quieres fumar o tienes que fumar? ¿Esa vida nocturna? ¿Sabes cuándo es hora de irte a casa o ya te está destruyendo el rendimiento? ¿Puedes ser decente haciendo lo que haces teniendo un problema con el alcohol? Probablemente. Pero nunca vas a ser grande.
                </p>
                <p className="apex-body">
                    Los verdaderos operadores nunca rinden bajo la influencia de nada. Le dan demasiado valor a su estado mental como para permitir que algo afecte su mente, sus instintos y sus reflejos.
                </p>
                <p className="apex-body" style={{ 
                    fontWeight: '900', 
                    color: 'var(--primary)', 
                    textAlign: 'center', 
                    marginTop: '24px',
                    marginBottom: '16px',
                    fontSize: '1.15rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    textShadow: '0 0 10px rgba(0, 255, 102, 0.4)'
                }}>
                    ¿Quién está al mando? ¿Tú o tu lado oscuro?
                </p>
            </div>
        </div>
    </div>
);

const ModFormula = () => (
    <div className="apex-detail-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div className="card" style={{ padding: '16px', border: '1px solid var(--alert)' }}>
            <h3 className="apex-card-title" style={{ color: 'var(--alert)' }}>LO QUE SALE DE TU CASA HOY</h3>
            <p className="apex-body" style={{ fontStyle: 'italic', marginBottom: '12px' }}>Si no lo compras, no lo comes. Tíralo.</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.85rem' }}>
                <div style={{ color: 'var(--dim)' }}>• Refrescos y jugos</div>
                <div style={{ color: 'var(--dim)' }}>• Galletas y pan</div>
                <div style={{ color: 'var(--dim)' }}>• Frituras bolsa</div>
                <div style={{ color: 'var(--dim)' }}>• Helado / Dulces</div>
                <div style={{ color: 'var(--dim)' }}>• Cereales azúcar</div>
                <div style={{ color: 'var(--dim)' }}>• Salsas/Mayonesa</div>
            </div>
        </div>

        <div className="card" style={{ padding: '16px' }}>
            <h3 className="apex-card-title" style={{ color: 'var(--warn)' }}>EL ANTOJO</h3>
            <p className="apex-body">
                El antojo no significa que necesitas azúcar. Tu cuerpo se está desintoxicando y probablemente estás deshidratado.
                Los primeros 7-10 días son duros. 
            </p>
            <div style={{
                background: 'rgba(0, 0, 0, 0.15)', borderLeft: '3px solid var(--alert)', padding: '12px 16px', margin: '12px 0', borderRadius: '0 4px 4px 0', fontStyle: 'italic', color: 'var(--label)', lineHeight: '1.5'
            }}>
                Tu cuerpo está pidiendo lo que estaba acostumbrado a recibir. Es como venom de grasa aferrándose a tu cuerpo porque es un parásito que no quiere abandonar ese organismo.
            </div>
            <p className="apex-body" style={{ fontWeight: 'bold', color: 'var(--primary)' }}>
                La clave es movimiento.
            </p>
            <p className="apex-body">
                Levántate y camina. Estira, haz sombra de box, qigong, yoga, breakdance, cumbia rebajada de monterrey, lo que quieras. No le das lo que pide. Le das agua, le das fruta. Respiras (box breathing). Después de 30 días, el antojo casi desaparece.
            </p>
        </div>

        <div className="card" style={{ padding: '16px', background: 'var(--panel)', border: '1px solid var(--primary)' }}>
            <h3 className="apex-card-title" style={{ color: 'var(--primary)', textAlign: 'center', borderBottom: 'none' }}>LA FÓRMULA</h3>
            <div style={{ textAlign: 'center', margin: '12px 0' }}>
                <div style={{ color: 'var(--label)', fontWeight: 'bold', marginBottom: '12px' }}>
                    Alimentación = Profit Center o Cost Center.
                </div>
                <div style={{ color: 'var(--primary)', marginBottom: '12px', fontSize: '0.9rem' }}>
                    Buena Comida + Movimiento = PROFIT CENTER<br/>
                    <span style={{ fontSize: '0.8rem', color: 'var(--dim)' }}>(energía, enfoque, rendimiento)</span>
                </div>
                <div style={{ color: 'var(--alert)', fontSize: '0.9rem' }}>
                    Comida Mierda = COST CENTER<br/>
                    <span style={{ fontSize: '0.8rem', color: 'var(--dim)' }}>(solo consume y te deja peor)</span>
                </div>
            </div>
            <p className="apex-body" style={{ textAlign: 'center', fontWeight: 'bold', marginTop: '12px' }}>
                Tú eliges en cuál operas.
            </p>
        </div>
    </div>
);

const ModMaintenanceDashboard = () => {
    const { logSession } = useDB();
    const [logging, setLogging] = useState(false);

    const handleLogMobility = async () => {
        setLogging(true);
        try {
            const dateStr = new Date().toLocaleDateString('en-CA');
            const sessionId = `mobility-${dateStr}-${Date.now()}`;
            
            const payload = {
                type: 'apex_session',
                version: '1',
                meta: {
                    sessionId,
                    date: dateStr,
                    blockId: 'MAINTENANCE',
                    dayNumber: 0,
                    sessionType: 'mobility',
                    focus: 'Morning Mobility',
                    notes: ''
                },
                rows: [
                    {
                        date: dateStr,
                        block: 'MAINTENANCE',
                        day: 0,
                        sessionType: 'mobility',
                        exercisePlanId: 'mob-1',
                        exerciseName: 'Morning Mobility',
                        target: 'Full Body',
                        supersetLabel: null,
                        prescribedSets: 1,
                        prescribedReps: 1,
                        prescribedRpe: null,
                        setNumber: 1,
                        load: 'DONE',
                        repsCompleted: 1,
                        rpeLogged: null,
                        notes: ''
                    }
                ]
            };
            
            await logSession(payload);
            alert('✅ Morning Mobility Logged!');
        } catch (err) {
            console.error(err);
            alert('Error logging mobility.');
        } finally {
            setLogging(false);
        }
    };

    return (
        <div className="apex-detail-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            <div className="card" style={{ borderLeft: '3px solid var(--primary)', padding: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div>
                        <h3 className="apex-card-title" style={{ color: 'var(--primary)', marginBottom: '4px' }}>MORNING MOBILITY</h3>
                        <p className="apex-body" style={{ fontSize: '0.85rem', color: 'var(--dim)', margin: 0 }}>
                            15 min protocol. Unlock joints, prime the nervous system.
                        </p>
                    </div>
                </div>
                
                <a href="https://drive.google.com/" target="_blank" rel="noreferrer" style={{ textDecoration: 'none', display: 'block', marginBottom: '12px' }}>
                    <div style={{
                        background: 'rgba(255,255,255,0.03)', border: '1px solid var(--divider)', 
                        padding: '12px', borderRadius: '6px', color: 'var(--text)', fontSize: '0.85rem',
                        textAlign: 'center', display: 'flex', justifyContent: 'center', gap: '8px', alignItems: 'center'
                    }}>
                        <span style={{ color: 'var(--primary)' }}>▶</span> WATCH ROUTINE
                    </div>
                </a>

                <button 
                    className="btn-primary" 
                    onClick={handleLogMobility} 
                    disabled={logging}
                    style={{ width: '100%', padding: '14px', fontSize: '0.9rem' }}
                >
                    {logging ? 'LOGGING...' : '✔ LOG COMPLETION'}
                </button>
            </div>

            <div className="card" style={{ borderLeft: '3px solid var(--alert)', padding: '16px' }}>
                <h3 className="apex-card-title" style={{ color: 'var(--alert)', marginBottom: '4px' }}>PRE-TRAINING WARMUP</h3>
                <p className="apex-body" style={{ fontSize: '0.85rem', color: 'var(--dim)', marginBottom: '16px' }}>
                    10 min sequence before loading the bar. Elevate core temp.
                </p>
                <a href="https://drive.google.com/" target="_blank" rel="noreferrer" style={{ textDecoration: 'none', display: 'block' }}>
                    <div style={{
                        background: 'rgba(255,255,255,0.03)', border: '1px solid var(--divider)', 
                        padding: '12px', borderRadius: '6px', color: 'var(--text)', fontSize: '0.85rem',
                        textAlign: 'center', display: 'flex', justifyContent: 'center', gap: '8px', alignItems: 'center'
                    }}>
                        <span style={{ color: 'var(--alert)' }}>▶</span> WATCH ROUTINE
                    </div>
                </a>
            </div>

            <div className="card" style={{ borderLeft: '3px solid var(--blue)', padding: '16px' }}>
                <h3 className="apex-card-title" style={{ color: 'var(--blue)', marginBottom: '4px' }}>POST-TRAINING COOLDOWN</h3>
                <p className="apex-body" style={{ fontSize: '0.85rem', color: 'var(--dim)', marginBottom: '16px' }}>
                    Down-regulate the nervous system and kickstart recovery.
                </p>
                <a href="https://drive.google.com/" target="_blank" rel="noreferrer" style={{ textDecoration: 'none', display: 'block' }}>
                    <div style={{
                        background: 'rgba(255,255,255,0.03)', border: '1px solid var(--divider)', 
                        padding: '12px', borderRadius: '6px', color: 'var(--text)', fontSize: '0.85rem',
                        textAlign: 'center', display: 'flex', justifyContent: 'center', gap: '8px', alignItems: 'center'
                    }}>
                        <span style={{ color: 'var(--blue)' }}>▶</span> WATCH ROUTINE
                    </div>
                </a>
            </div>
        </div>
    );
};


const renderNutritionModule = (moduleName) => {
    switch (moduleName) {
        case 'La Regla Cero': return <ModReglaCero />;
        case 'Estructura del Día': return <ModEstructura />;
        case 'Sistema de Medición': return <ModMedicion />;
        case 'Reglas por Comida': return <ModReglas />;
        case 'Operación Diaria': return <ModOperacion />;
        default: return (
            <div className="apex-detail-wrapper card" style={{ padding: '20px', textAlign: 'center' }}>
                <p className="apex-body" style={{ fontStyle: 'italic', textAlign: 'center' }}>
                    Content pending...
                </p>
            </div>
        );
    }
};

const renderCookingModule = (moduleName) => {
    switch (moduleName) {
        case 'El Sistema Batch': return <ModSistemaBatch />;
        case 'Batch de Proteína': return <ModBatchProteina />;
        case 'Batch de Carbos y Verdura': return <ModBatchCarbos />;
        case 'Comidas sin Batch': return <ModSinBatch />;
        case 'Logística Semanal': return <ModLogistica />;
        default: return (
            <div className="apex-detail-wrapper card" style={{ padding: '20px', textAlign: 'center' }}>
                <p className="apex-body" style={{ fontStyle: 'italic', textAlign: 'center' }}>
                    Content pending...
                </p>
            </div>
        );
    }
};

const renderFoodGuideModule = (moduleName) => {
    switch (moduleName) {
        case 'Regla Maestra': return <ModReglaMaestra />;
        case 'Listas de Combustible': return <ModListasCombustible />;
        case 'Sustituciones Tácticas': return <ModSustituciones />;
        case 'Operaciones de Campo': return <ModOperacionesCampo />;
        case 'Alcohol y The Sauce': return <ModAlcohol />;
        case 'La Fórmula': return <ModFormula />;
        default: return (
            <div className="apex-detail-wrapper card" style={{ padding: '20px', textAlign: 'center' }}>
                <p className="apex-body" style={{ fontStyle: 'italic', textAlign: 'center' }}>
                    Content pending...
                </p>
            </div>
        );
    }
};

export default function ApexTab() {

    const [currentCategory, setCurrentCategory] = useState(null);
    const [selectedModule, setSelectedModule] = useState(null);

    const handleBack = () => {
        if (selectedModule) {
            setSelectedModule(null);
        } else {
            setCurrentCategory(null);
        }
    };

    if (selectedModule) {
        return (
            <>
                <div className="page-header">
                    <h1>{selectedModule}</h1>
                    <div className="subtitle">{currentCategory.title}</div>
                </div>
                <div className="content">
                    <button onClick={handleBack} className="btn-secondary" style={{ marginBottom: '16px' }}>
                        ← Regresar
                    </button>
                    {currentCategory.id === 'nutrition' ? (
                        renderNutritionModule(selectedModule)
                    ) : currentCategory.id === 'cooking' ? (
                        renderCookingModule(selectedModule)
                    ) : currentCategory.id === 'food_guide' ? (
                        renderFoodGuideModule(selectedModule)
                    ) : (
                        <div className="apex-detail-wrapper card" style={{ padding: '20px', textAlign: 'center' }}>
                            <p className="apex-body" style={{ fontStyle: 'italic', textAlign: 'center' }}>
                                Content pending...
                            </p>
                        </div>
                    )}
                </div>
            </>
        );
    }

    if (currentCategory) {
        if (currentCategory.id === 'maintenance') {
            return (
                <>
                    <div className="page-header">
                        <h1>{currentCategory.title}</h1>
                        <div className="subtitle">OPERATIONAL PROTOCOLS</div>
                    </div>
                    <div className="content">
                        <button onClick={handleBack} className="btn-secondary" style={{ marginBottom: '16px' }}>
                            ← Regresar a APEX
                        </button>
                        <ModMaintenanceDashboard />
                    </div>
                </>
            );
        }

        return (
            <>
                <div className="page-header">
                    <h1>{currentCategory.title}</h1>
                    <div className="subtitle">MÓDULOS DE ENTRENAMIENTO</div>
                </div>
                <div className="content">
                    <button onClick={handleBack} className="btn-secondary" style={{ marginBottom: '16px' }}>
                        ← Regresar a APEX
                    </button>
                    
                    <div className="apex-detail-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {currentCategory.modules.map((mod, idx) => (
                            <button
                                key={idx}
                                onClick={() => setSelectedModule(mod)}
                                className="card"
                                style={{ 
                                    width: '100%', 
                                    textAlign: 'left', 
                                    padding: '16px', 
                                    display: 'flex', 
                                    justifyContent: 'space-between', 
                                    alignItems: 'center',
                                    border: '1px solid var(--divider)',
                                    background: 'var(--panel)'
                                }}
                            >
                                <span style={{ fontWeight: '600', color: 'var(--label)', fontSize: '0.95rem' }}>
                                    {mod}
                                </span>
                                <span style={{ color: 'var(--dim)', fontSize: '1.2rem' }}>›</span>
                            </button>
                        ))}
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <div className="page-header">
                <h1>APEX PROTOCOL</h1>
                <div className="subtitle">TACTICAL KNOWLEDGE BASE</div>
            </div>
            <div className="content">
                <div className="apex-detail-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '8px' }}>
                    {Object.values(CATEGORIES).map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setCurrentCategory(cat)}
                            className="card"
                            style={{ 
                                width: '100%', 
                                textAlign: 'left', 
                                padding: '16px 20px', 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '16px',
                                borderLeft: `4px solid ${
                                    cat.id === 'nutrition' ? 'var(--alert)' : 
                                    cat.id === 'cooking' ? 'var(--warn)' :
                                    cat.id === 'maintenance' ? 'var(--blue)' : 'var(--primary)'
                                }`,
                                background: 'var(--panel)'
                            }}
                        >
                            <span style={{ fontSize: '2rem' }}>{cat.icon}</span>
                            <div>
                                <h2 style={{ 
                                    fontSize: '1rem', 
                                    fontWeight: '700', 
                                    color: 'var(--primary)', 
                                    textTransform: 'uppercase', 
                                    letterSpacing: '0.05em',
                                    marginBottom: '4px'
                                }}>
                                    {cat.title}
                                </h2>
                                <p style={{ fontSize: '0.75rem', color: 'var(--dim)' }}>
                                    {cat.modules.length > 0 ? `${cat.modules.length} módulos` : 'Operación Diaria'}
                                </p>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </>
    );
}
