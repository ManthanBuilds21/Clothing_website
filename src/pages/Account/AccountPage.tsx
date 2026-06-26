import { Package, MapPin, Trash2, LogOut } from 'lucide-react'
import { useEffect, useState } from 'react'
import Reveal from '../../components/ui/Reveal'
import PillTabs from '../../components/ui/PillTabs'
import { useAuth } from '../../hooks/useAuth'
import { useToast } from '../../hooks/useToast'
import { getAccountOrders, getAccountAddresses, deleteAccountAddress } from '../../lib/api'
import { formatPrice } from '../../utils/format'

export default function AccountPage() {
  const { token, user, logout } = useAuth()
  const toast = useToast()
  const [activeTab, setActiveTab] = useState('Orders')
  const [orders, setOrders] = useState<any[]>([])
  const [addresses, setAddresses] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!token) return

    Promise.all([
      getAccountOrders(token).then((res) => setOrders(res.orders)),
      getAccountAddresses(token).then((res) => setAddresses(res.addresses)),
    ])
      .catch(() => toast.error('Could not load account details.'))
      .finally(() => setIsLoading(false))
  }, [token, toast])

  const handleDeleteAddress = async (id: string) => {
    if (!token) return
    try {
      await deleteAccountAddress(token, id)
      setAddresses((prev) => prev.filter((a) => a.id !== id))
      toast.success('Address deleted.')
    } catch {
      toast.error('Could not delete address.')
    }
  }

  if (isLoading) return null

  return (
    <div className="page-shell pb-8">
      <Reveal className="section-frame campaign-surface overflow-hidden px-5 py-8 sm:px-8 sm:py-10 bg-[var(--beige)]">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="eyebrow">Account</p>
            <h1 className="mt-5 max-w-4xl text-[3rem] leading-[0.86] sm:text-[5rem] lg:text-[6.5rem]">
              Welcome back, {user?.name.split(' ')[0]}.
            </h1>
            <p className="mt-5 text-sm leading-7 text-black/[0.68] sm:text-base">
              {user?.email}
            </p>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 rounded-full border border-black/10 bg-white/50 px-5 py-3 text-xs font-semibold uppercase tracking-[0.24em] transition-colors hover:bg-white"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </Reveal>

      <Reveal className="section-frame mt-10">
        <PillTabs
          active={activeTab}
          items={['Orders', 'Addresses']}
          onChange={setActiveTab}
        />
      </Reveal>

      <div className="section-frame mt-8">
        {activeTab === 'Orders' ? (
          orders.length === 0 ? (
            <Reveal className="campaign-surface bg-[var(--cloud)] p-8 sm:p-12 text-center">
              <Package className="mx-auto h-8 w-8 text-black/20" />
              <p className="mt-4 text-sm leading-7 text-black/[0.68]">You haven't placed any orders yet.</p>
            </Reveal>
          ) : (
            <div className="grid gap-6">
              {orders.map((order) => (
                <Reveal key={order.id} className="campaign-surface bg-white p-6 sm:p-8">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between border-b border-black/5 pb-6">
                    <div>
                      <p className="eyebrow text-black/40">Order #{order.id.slice(0, 8).toUpperCase()}</p>
                      <p className="mt-2 text-sm text-black/[0.68]">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="text-left sm:text-right">
                      <span className="rounded-full bg-[var(--cloud)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-black">
                        {order.status}
                      </span>
                      <p className="mt-3 text-xl font-semibold">{formatPrice(order.total)}</p>
                    </div>
                  </div>
                  <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {order.items.map((item: any) => (
                      <div key={item.id} className="flex gap-4">
                        <img src={item.productImage} alt={item.productName} className="h-20 w-16 object-cover rounded-lg bg-[var(--cloud)]" />
                        <div>
                          <p className="font-semibold">{item.productName}</p>
                          <p className="text-sm text-black/60">Size: {item.size}</p>
                          <p className="text-sm text-black/60">Qty: {item.quantity}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Reveal>
              ))}
            </div>
          )
        ) : (
          addresses.length === 0 ? (
            <Reveal className="campaign-surface bg-[var(--cloud)] p-8 sm:p-12 text-center">
              <MapPin className="mx-auto h-8 w-8 text-black/20" />
              <p className="mt-4 text-sm leading-7 text-black/[0.68]">You have no saved addresses.</p>
            </Reveal>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {addresses.map((address) => (
                <Reveal key={address.id} className="campaign-surface bg-white p-6 relative">
                  <button
                    onClick={() => handleDeleteAddress(address.id)}
                    className="absolute top-4 right-4 text-black/40 hover:text-red-500 transition-colors"
                    aria-label="Delete address"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                  <p className="font-semibold text-lg">{address.name}</p>
                  <div className="mt-3 text-sm leading-6 text-black/70">
                    <p>{address.street}</p>
                    <p>{address.city}, {address.state} {address.postalCode}</p>
                    <p>{address.country}</p>
                    <p className="mt-2 text-black/50">{address.phone}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  )
}
