import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

interface Product {
  id: string;
  name: string;
  barcode: string;
  stock: number;
  minStock: number;
  category: string;
  price: number;
}

const mockProducts: Product[] = [
  { id: '1', name: 'Помада L'Oreal Rouge Signature', barcode: '3600523567898', stock: 24, minStock: 10, category: 'Макияж', price: 599 },
  { id: '2', name: 'Крем для рук Nivea', barcode: '4005900234567', stock: 5, minStock: 15, category: 'Уход', price: 249 },
  { id: '3', name: 'Тушь Maybelline Lash Sensational', barcode: '3600531234567', stock: 18, minStock: 8, category: 'Макияж', price: 699 },
  { id: '4', name: 'Лак для ногтей Essie', barcode: '3600523234567', stock: 31, minStock: 12, category: 'Маникюр', price: 449 },
];

export default function Index() {
  const [currentView, setCurrentView] = useState<'home' | 'scan' | 'inventory' | 'orders'>('home');
  const [scannedProduct, setScannedProduct] = useState<Product | null>(null);
  const [orderItems, setOrderItems] = useState<Product[]>([]);

  const handleScan = () => {
    const randomProduct = mockProducts[Math.floor(Math.random() * mockProducts.length)];
    setScannedProduct(randomProduct);
    toast.success(`Товар отсканирован: ${randomProduct.name}`);
  };

  const addToOrder = (product: Product) => {
    setOrderItems([...orderItems, product]);
    toast.success('Товар добавлен в заказ');
  };

  const completeOrder = () => {
    toast.success(`Заказ собран! Товаров: ${orderItems.length}`);
    setOrderItems([]);
  };

  const lowStockCount = mockProducts.filter(p => p.stock < p.minStock).length;
  const totalStock = mockProducts.reduce((sum, p) => sum + p.stock, 0);

  if (currentView === 'scan') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-purple-100 to-purple-200 p-4">
        <div className="max-w-2xl mx-auto">
          <Button 
            variant="ghost" 
            onClick={() => setCurrentView('home')}
            className="mb-4 text-purple-900"
          >
            <Icon name="ArrowLeft" size={20} />
            <span className="ml-2">Назад</span>
          </Button>

          <Card className="glass p-8 mb-6 shadow-2xl">
            <div className="flex flex-col items-center">
              <div className="w-32 h-32 bg-purple-400 rounded-3xl flex items-center justify-center mb-6 shadow-lg">
                <Icon name="Scan" size={64} className="text-white" />
              </div>
              <h2 className="text-2xl font-bold text-purple-900 mb-4">Сканирование товара</h2>
              <Button 
                onClick={handleScan}
                size="lg"
                className="bg-purple-400 hover:bg-purple-500 text-white px-12 py-6 text-lg rounded-2xl shadow-xl hover:scale-105 transition-all"
              >
                <Icon name="Camera" size={24} />
                <span className="ml-3">Сканировать штрихкод</span>
              </Button>
            </div>
          </Card>

          {scannedProduct && (
            <Card className="glass-dark p-6 shadow-2xl animate-scale-in">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-purple-900 mb-2">{scannedProduct.name}</h3>
                  <p className="text-sm text-purple-600">Штрихкод: {scannedProduct.barcode}</p>
                  <Badge className="mt-2 bg-purple-200 text-purple-800">{scannedProduct.category}</Badge>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-purple-900">{scannedProduct.price} ₽</p>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-white/60 rounded-xl">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-purple-800 font-semibold">Остаток на складе</span>
                  <span className={`text-2xl font-bold ${scannedProduct.stock < scannedProduct.minStock ? 'text-red-600' : 'text-green-600'}`}>
                    {scannedProduct.stock} шт
                  </span>
                </div>
                <Progress 
                  value={(scannedProduct.stock / (scannedProduct.minStock * 2)) * 100} 
                  className="h-3"
                />
                <p className="text-xs text-purple-600 mt-2">Минимальный остаток: {scannedProduct.minStock} шт</p>
                
                {scannedProduct.stock < scannedProduct.minStock && (
                  <div className="mt-4 p-3 bg-red-100 rounded-lg border-l-4 border-red-500">
                    <p className="text-sm font-semibold text-red-800 flex items-center">
                      <Icon name="AlertTriangle" size={16} className="mr-2" />
                      Требуется заказ товара!
                    </p>
                  </div>
                )}
              </div>

              <Button 
                onClick={() => addToOrder(scannedProduct)}
                className="w-full mt-6 bg-purple-500 hover:bg-purple-600 text-white py-6 text-lg rounded-xl"
              >
                <Icon name="ShoppingCart" size={20} />
                <span className="ml-2">Добавить в заказ</span>
              </Button>
            </Card>
          )}
        </div>
      </div>
    );
  }

  if (currentView === 'inventory') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-purple-100 to-purple-200 p-4">
        <div className="max-w-4xl mx-auto">
          <Button 
            variant="ghost" 
            onClick={() => setCurrentView('home')}
            className="mb-4 text-purple-900"
          >
            <Icon name="ArrowLeft" size={20} />
            <span className="ml-2">Назад</span>
          </Button>

          <Card className="glass p-6 mb-6 shadow-2xl">
            <h2 className="text-2xl font-bold text-purple-900 mb-6">Контроль остатков</h2>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="glass-dark p-4 rounded-xl">
                <p className="text-sm text-purple-600 mb-1">Всего товаров</p>
                <p className="text-3xl font-bold text-purple-900">{totalStock}</p>
              </div>
              <div className="glass-dark p-4 rounded-xl">
                <p className="text-sm text-purple-600 mb-1">Требует заказа</p>
                <p className="text-3xl font-bold text-red-600">{lowStockCount}</p>
              </div>
            </div>

            <div className="space-y-3">
              {mockProducts.map((product) => (
                <div key={product.id} className="glass-dark p-4 rounded-xl">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-semibold text-purple-900">{product.name}</h4>
                      <p className="text-xs text-purple-600">{product.category}</p>
                    </div>
                    <Badge className={product.stock < product.minStock ? 'bg-red-200 text-red-800' : 'bg-green-200 text-green-800'}>
                      {product.stock} шт
                    </Badge>
                  </div>
                  <Progress value={(product.stock / (product.minStock * 2)) * 100} className="h-2" />
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (currentView === 'orders') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-purple-100 to-purple-200 p-4">
        <div className="max-w-2xl mx-auto">
          <Button 
            variant="ghost" 
            onClick={() => setCurrentView('home')}
            className="mb-4 text-purple-900"
          >
            <Icon name="ArrowLeft" size={20} />
            <span className="ml-2">Назад</span>
          </Button>

          <Card className="glass p-6 shadow-2xl">
            <h2 className="text-2xl font-bold text-purple-900 mb-6">Сборка заказа</h2>
            
            {orderItems.length === 0 ? (
              <div className="text-center py-12">
                <Icon name="Package" size={64} className="mx-auto text-purple-300 mb-4" />
                <p className="text-purple-600">Начните сканировать товары</p>
              </div>
            ) : (
              <>
                <div className="space-y-3 mb-6">
                  {orderItems.map((item, idx) => (
                    <div key={idx} className="glass-dark p-4 rounded-xl flex justify-between items-center">
                      <div>
                        <p className="font-semibold text-purple-900">{item.name}</p>
                        <p className="text-sm text-purple-600">{item.price} ₽</p>
                      </div>
                      <Icon name="Check" className="text-green-600" size={24} />
                    </div>
                  ))}
                </div>

                <div className="glass-dark p-4 rounded-xl mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-purple-800 font-semibold">Итого товаров:</span>
                    <span className="text-2xl font-bold text-purple-900">{orderItems.length}</span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-purple-800 font-semibold">Сумма:</span>
                    <span className="text-2xl font-bold text-purple-900">
                      {orderItems.reduce((sum, item) => sum + item.price, 0)} ₽
                    </span>
                  </div>
                </div>

                <Button 
                  onClick={completeOrder}
                  className="w-full bg-purple-500 hover:bg-purple-600 text-white py-6 text-lg rounded-xl"
                >
                  <Icon name="CheckCircle" size={24} />
                  <span className="ml-2">Завершить заказ</span>
                </Button>
              </>
            )}
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-purple-100 to-purple-200 p-4">
      <div className="max-w-4xl mx-auto py-8">
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold text-purple-900 mb-2">Подружка</h1>
          <p className="text-purple-600">Рабочее место сотрудника</p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card 
            className="glass p-6 shadow-xl hover:shadow-2xl transition-all cursor-pointer hover:scale-105 active:scale-95"
            onClick={() => setCurrentView('scan')}
          >
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-purple-400 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                <Icon name="Scan" size={36} className="text-white" />
              </div>
              <h3 className="text-lg font-bold text-purple-900 text-center">Сканирование товара</h3>
            </div>
          </Card>

          <Card 
            className="glass p-6 shadow-xl hover:shadow-2xl transition-all cursor-pointer hover:scale-105 active:scale-95"
            onClick={() => setCurrentView('inventory')}
          >
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-purple-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                <Icon name="ClipboardList" size={36} className="text-white" />
              </div>
              <h3 className="text-lg font-bold text-purple-900 text-center">Инвентаризация</h3>
            </div>
          </Card>

          <Card 
            className="glass p-6 shadow-xl hover:shadow-2xl transition-all cursor-pointer hover:scale-105 active:scale-95"
            onClick={() => setCurrentView('orders')}
          >
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-purple-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                <Icon name="Package" size={36} className="text-white" />
              </div>
              <h3 className="text-lg font-bold text-purple-900 text-center">Сборка заказа</h3>
            </div>
          </Card>

          <Card 
            className="glass p-6 shadow-xl hover:shadow-2xl transition-all cursor-pointer hover:scale-105 active:scale-95"
            onClick={() => toast.info('Функция в разработке')}
          >
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-purple-700 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                <Icon name="PackageOpen" size={36} className="text-white" />
              </div>
              <h3 className="text-lg font-bold text-purple-900 text-center">Разборка коробок</h3>
            </div>
          </Card>
        </div>

        <Card className="glass-dark p-6 shadow-2xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-purple-900">Контроль остатков</h3>
            <Badge className="bg-red-200 text-red-800">
              <Icon name="AlertCircle" size={14} className="mr-1" />
              {lowStockCount} требуют заказа
            </Badge>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-900">{totalStock}</p>
              <p className="text-xs text-purple-600">Всего товаров</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{mockProducts.filter(p => p.stock >= p.minStock).length}</p>
              <p className="text-xs text-purple-600">В наличии</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">{lowStockCount}</p>
              <p className="text-xs text-purple-600">Низкий остаток</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
