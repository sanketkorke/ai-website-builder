import React, { useState, useEffect } from 'react';
import { LogIn, LayoutDashboard, ListOrdered, FileText, CheckCircle, Clock, DollarSign, Send, Edit, Save, X, Eye, ExternalLink, RefreshCw } from 'lucide-react';

// --- Base API URL (Set to your production backend) ---
const API_URL = "https://ai-website-builder-klgp.onrender.com";

// --- Main Admin Component ---
const AdminApp = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [view, setView] = useState('dashboard'); // dashboard, orders
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const res = await fetch(`${API_URL}/api/admin/login`, { // <-- CORRECT URL
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password }),
            });
            const data = await res.json();
            if (data.success) {
                setIsLoggedIn(true);
            } else {
                setError(data.error || 'Invalid password');
            }
        } catch (err) {
            setError('Server error. Please try again.');
        }
    };

    const fetchOrders = async () => {
        setIsLoading(true);
        try {
            const res = await fetch(`${API_URL}/api/admin/orders`); // <-- CORRECT URL
            const data = await res.json();
            if (data.success) {
                // Sort by creation date, newest first
                const sortedOrders = data.orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setOrders(sortedOrders);
            } else {
                setError('Failed to fetch orders.');
            }
        } catch (err) {
            setError('Server error. Failed to fetch orders.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (isLoggedIn) {
            fetchOrders();
        }
    }, [isLoggedIn]);

    if (!isLoggedIn) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-900">
                <form onSubmit={handleLogin} className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-sm">
                    <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Admin Login</h2>
                    <div className="space-y-4">
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter Admin Password (Hint: admin123)"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                        <button type="submit" className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2">
                            <LogIn className="w-5 h-5" />
                            <span>Login</span>
                        </button>
                    </div>
                </form>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-slate-100">
            {/* Sidebar */}
            <nav className="w-64 bg-slate-900 text-white flex flex-col">
                <div className="text-2xl font-bold text-center py-6 px-4 border-b border-slate-700">
                    AI Admin Panel
                </div>
                <div className="flex-grow p-4 space-y-2">
                    <button
                        onClick={() => setView('dashboard')}
                        className={`flex items-center space-x-3 w-full px-4 py-3 rounded-lg transition-colors ${view === 'dashboard' ? 'bg-purple-600 text-white' : 'hover:bg-slate-700'}`}
                    >
                        <LayoutDashboard className="w-5 h-5" />
                        <span>Dashboard</span>
                    </button>
                    <button
                        onClick={() => setView('orders')}
                        className={`flex items-center space-x-3 w-full px-4 py-3 rounded-lg transition-colors ${view === 'orders' ? 'bg-purple-600 text-white' : 'hover:bg-slate-700'}`}
                    >
                        <ListOrdered className="w-5 h-5" />
                        <span>All Orders</span>
                    </button>
                </div>
                <div className="p-4 border-t border-slate-700">
                    <button
                        onClick={() => setIsLoggedIn(false)}
                        className="flex items-center space-x-3 w-full px-4 py-3 rounded-lg text-red-400 hover:bg-red-900/50 transition-colors"
                    >
                        <span>Logout</span>
                    </button>
                </div>
            </nav>

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-auto">
                {view === 'dashboard' && <DashboardView orders={orders} onRefresh={fetchOrders} isLoading={isLoading} />}
                {view === 'orders' && <OrdersView orders={orders} onRefresh={fetchOrders} isLoading={isLoading} onUpdate={fetchOrders} />}
            </main>
        </div>
    );
};

// --- Dashboard View Component ---
const DashboardView = ({ orders, onRefresh, isLoading }) => {
    const newOrders = orders.filter(o => o.orderStatus === 'new').length;
    const contacted = orders.filter(o => o.orderStatus === 'contacted').length;
    const delivered = orders.filter(o => o.orderStatus === 'delivered').length;
    
    // Calculate total revenue from orders with payment status 'advance_paid' or 'full_paid'
    const totalRevenue = orders
        .filter(o => o.paymentStatus === 'advance_paid' || o.paymentStatus === 'full_paid')
        .reduce((sum, o) => sum + (o.paymentStatus === 'full_paid' ? o.finalAmount : o.advanceAmount), 0);

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-4xl font-bold text-gray-800">Dashboard</h1>
                <button onClick={onRefresh} className="p-2 bg-white rounded-lg shadow hover:bg-slate-50 transition-colors">
                    <RefreshCw className={`w-5 h-5 text-gray-600 ${isLoading ? 'animate-spin' : ''}`} />
                </button>
            </div>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard title="Total Orders" value={orders.length} icon={ListOrdered} color="blue" />
                <StatCard title="New Leads" value={newOrders} icon={FileText} color="purple" />
                <StatCard title="Delivered Sites" value={delivered} icon={CheckCircle} color="green" />
                <StatCard title="Total Revenue (Advance Only)" value={`₹${totalRevenue.toLocaleString('en-IN')}`} icon={DollarSign} color="yellow" />
            </div>

            {/* Recent Orders */}
            <h2 className="text-2xl font-bold text-gray-700 mb-4">Recent Orders (New)</h2>
            <div className="bg-white rounded-2xl shadow-lg">
                {isLoading ? (
                    <p className="p-6 text-center text-gray-500">Loading orders...</p>
                ) : (
                    <OrdersTable orders={orders.filter(o => o.orderStatus === 'new').slice(0, 5)} onUpdate={onRefresh} />
                )}
            </div>
        </div>
    );
};

// --- Orders View Component ---
const OrdersView = ({ orders, onRefresh, isLoading, onUpdate }) => {
    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-4xl font-bold text-gray-800">All Orders</h1>
                <button onClick={onRefresh} className="p-2 bg-white rounded-lg shadow hover:bg-slate-50 transition-colors">
                    <RefreshCw className={`w-5 h-5 text-gray-600 ${isLoading ? 'animate-spin' : ''}`} />
                </button>
            </div>
            
            <div className="bg-white rounded-2xl shadow-lg">
                {isLoading ? (
                    <p className="p-6 text-center text-gray-500">Loading orders...</p>
                ) : (
                    <OrdersTable orders={orders} onUpdate={onUpdate} />
                )}
            </div>
        </div>
    );
};

// --- Reusable Stat Card Component ---
const StatCard = ({ title, value, icon: Icon, color }) => {
    const colors = {
        blue: 'from-blue-500 to-blue-600',
        purple: 'from-purple-600 to-purple-700',
        green: 'from-green-500 to-green-600',
        yellow: 'from-yellow-500 to-yellow-600',
    };
    return (
        <div className={`bg-gradient-to-br ${colors[color]} text-white p-6 rounded-2xl shadow-xl`}>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold opacity-80">{title}</h3>
                <Icon className="w-6 h-6 opacity-70" />
            </div>
            <p className="text-4xl font-bold">{value}</p>
        </div>
    );
};

// --- Reusable Orders Table ---
const OrdersTable = ({ orders, onUpdate }) => {
    const [editingOrder, setEditingOrder] = useState(null); // State to hold order being edited
    const [viewingOrder, setViewingOrder] = useState(null); // State to hold order being viewed

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead className="border-b border-slate-200">
                    <tr>
                        <th className="p-4 text-sm font-semibold text-gray-600">Date</th>
                        <th className="p-4 text-sm font-semibold text-gray-600">Business Name</th>
                        <th className="p-4 text-sm font-semibold text-gray-600">Phone</th>
                        <th className="p-4 text-sm font-semibold text-gray-600">Design</th>
                        <th className="p-4 text-sm font-semibold text-gray-600">Payment</th>
                        <th className="p-4 text-sm font-semibold text-gray-600">Status</th>
                        <th className="p-4 text-sm font-semibold text-gray-600">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.length === 0 && (
                        <tr>
                            <td colSpan="7" className="p-6 text-center text-gray-500">No orders found.</td>
                        </tr>
                    )}
                    {orders.map(order => (
                        <tr key={order._id} className="border-b border-slate-100 hover:bg-slate-50">
                            <td className="p-4 text-sm text-gray-700">{new Date(order.createdAt).toLocaleDateString('en-IN')}</td>
                            <td className="p-4 font-medium text-gray-900">{order.businessName}</td>
                            <td className="p-4 text-gray-700">{order.userId?.phone || 'N/A'}</td>
                            <td className="p-4 text-sm text-gray-700">{order.selectedDesignStyle}</td>
                            <td className="p-4 text-sm">
                                {order.paymentStatus === 'advance_paid' && <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full font-medium">Advance</span>}
                                {order.paymentStatus === 'full_paid' && <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full font-medium">Full Paid</span>}
                            </td>
                            <td className="p-4 text-sm">
                                {order.orderStatus === 'new' && <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">New</span>}
                                {order.orderStatus === 'contacted' && <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full font-medium">Contacted</span>}
                                {order.orderStatus === 'delivered' && <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full font-medium">Delivered</span>}
                            </td>
                            <td className="p-4 flex items-center space-x-2">
                                {/* Use an anchor tag if the order has a deliveryUrl */}
                                {order.orderStatus === 'delivered' && order.deliveryUrl ? (
                                    <a href={order.deliveryUrl} target="_blank" rel="noopener noreferrer" className="p-2 text-green-600 hover:bg-green-100 rounded-lg">
                                        <ExternalLink className="w-5 h-5" />
                                    </a>
                                ) : (
                                    <button onClick={() => setViewingOrder(order)} className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg">
                                        <Eye className="w-5 h-5" />
                                    </button>
                                )}
                                
                                <button onClick={() => setEditingOrder(order)} className="p-2 text-purple-600 hover:bg-purple-100 rounded-lg">
                                    <Edit className="w-5 h-5" />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* View Order Modal */}
            {viewingOrder && (
                <ViewOrderModal order={viewingOrder} onClose={() => setViewingOrder(null)} />
            )}

            {/* Edit Order Modal */}
            {editingOrder && (
                <EditOrderModal order={editingOrder} onClose={() => setEditingOrder(null)} onUpdate={onUpdate} />
            )}
        </div>
    );
};

// --- View Order Modal ---
const ViewOrderModal = ({ order, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col">
                <div className="flex justify-between items-center p-6 border-b">
                    <h3 className="text-2xl font-bold text-gray-800">Preview: {order.businessName}</h3>
                    <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100">
                        <X className="w-6 h-6 text-gray-600" />
                    </button>
                </div>
                <div className="flex-grow overflow-auto">
                    <iframe
                        srcDoc={order.selectedWebsiteHtml}
                        title={`Preview: ${order.businessName}`}
                        className="w-full h-[60vh] border-0"
                        sandbox="allow-scripts allow-same-origin"
                    />
                </div>
                <div className="p-6 bg-slate-50 border-t rounded-b-2xl">
                    <div className="flex justify-between items-center">
                         {order.deliveryUrl && (
                            <a 
                                href={order.deliveryUrl} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="flex items-center space-x-2 text-purple-600 hover:text-purple-700 font-semibold"
                            >
                                <ExternalLink className="w-4 h-4" />
                                <span>View Live Site</span>
                            </a>
                        )}
                        <button onClick={onClose} className="ml-auto px-6 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors">
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Edit Order Modal ---
const EditOrderModal = ({ order, onClose, onUpdate }) => {
    const [status, setStatus] = useState(order.orderStatus);
    const [deliveryUrl, setDeliveryUrl] = useState(order.deliveryUrl || '');
    const [paymentStatus, setPaymentStatus] = useState(order.paymentStatus);
    const [isSaving, setIsSaving] = useState(false);
    const [updateError, setUpdateError] = useState(''); // New state for error message

    // Update status to delivered if URL is set and order isn't already delivered
    useEffect(() => {
        if (deliveryUrl && status !== 'delivered') {
            setStatus('delivered');
        } else if (!deliveryUrl && status === 'delivered' && order.deliveryUrl) {
            // This handles if the user clears a previously set URL
            setStatus('contacted');
        }
    }, [deliveryUrl, status, order.deliveryUrl]);

    const handleSave = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setUpdateError('');
        try {
            const res = await fetch(`${API_URL}/api/admin/orders/${order._id}`, { // <-- CORRECT URL
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    orderStatus: status, 
                    deliveryUrl,
                    paymentStatus
                }),
            });
            
            if (res.ok) {
                onUpdate(); // Refresh the orders list
                onClose(); // Close the modal
            } else {
                const errorData = await res.json();
                setUpdateError(errorData.error || 'Failed to update order status.');
            }
        } catch (err) {
            setUpdateError('Server error. Failed to communicate with the database.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <form onSubmit={handleSave} className="bg-white rounded-2xl shadow-xl w-full max-w-lg">
                <div className="flex justify-between items-center p-6 border-b">
                    <h3 className="text-2xl font-bold text-gray-800">Edit Order: {order.businessName}</h3>
                    <button type="button" onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100" disabled={isSaving}>
                        <X className="w-6 h-6 text-gray-600" />
                    </button>
                </div>
                <div className="p-6 space-y-6">
                    {updateError && (
                        <div className="p-3 bg-red-100 text-red-700 border border-red-300 rounded-lg">
                            Error: {updateError}
                        </div>
                    )}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Order Status</label>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            disabled={isSaving}
                        >
                            <option value="new">New</option>
                            <option value="contacted">Contacted</option>
                            <option value="delivered">Delivered</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Payment Status</label>
                        <select
                            value={paymentStatus}
                            onChange={(e) => setPaymentStatus(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            disabled={isSaving}
                        >
                            <option value="advance_paid">Advance Paid (₹199)</option>
                            <option value="full_paid">Full Paid (₹3999)</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Delivery URL (e.g., Vercel, Netlify)</label>
                        <input
                            type="url"
                            value={deliveryUrl}
                            onChange={(e) => setDeliveryUrl(e.target.value)}
                            placeholder="https://your-site.vercel.app"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            disabled={isSaving}
                        />
                    </div>
                    <div className="flex items-start space-x-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <ExternalLink className="w-5 h-5 text-blue-500 flex-shrink-0 mt-1" />
                        <span className="text-sm text-gray-600">
                            **Note:** Setting a Delivery URL automatically updates the **Order Status** to 'Delivered' on save.
                        </span>
                    </div>
                </div>
                <div className="flex justify-end p-6 bg-slate-50 border-t rounded-b-2xl space-x-3">
                    <button type="button" onClick={onClose} className="px-6 py-2 bg-slate-200 text-gray-700 rounded-lg hover:bg-slate-300 transition-colors" disabled={isSaving}>
                        Cancel
                    </button>
                    <button 
                        type="submit" 
                        disabled={isSaving}
                        className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2 disabled:opacity-70"
                    >
                        <Save className="w-5 h-5" />
                        <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AdminApp;