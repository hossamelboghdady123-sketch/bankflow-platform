import { useCallback, useEffect, useState } from 'react'
import {
  ArrowDownLeft,
  ArrowLeftRight,
  ArrowUpRight,
  Bell,
  CheckCircle2,
  CircleDollarSign,
  Clock3,
  CreditCard,
  Landmark,
  LayoutDashboard,
  LoaderCircle,
  RefreshCw,
  Send,
  ShieldCheck,
  Wallet,
} from 'lucide-react'
import './App.css'

const money = (value) =>
  new Intl.NumberFormat('en-EG', {
    style: 'currency',
    currency: 'EGP',
    minimumFractionDigits: 2,
  }).format(Number(value ?? 0))

const dateTime = (value) =>
  new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))

async function apiRequest(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...options.headers,
    },
  })

  if (!response.ok) {
    let message = `Request failed (${response.status})`
    try {
      const body = await response.json()
      message = body.message || body.detail || body.error || message
    } catch {
      // Keep the HTTP status message if the response isn't JSON.
    }
    throw new Error(message)
  }

  return response.json()
}

function App() {
  const [accounts, setAccounts] = useState([])
  const [transactions, setTransactions] = useState([])
  const [fromAccount, setFromAccount] = useState('')
  const [toAccount, setToAccount] = useState('')
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  const loadDashboard = useCallback(async () => {
    setError('')
    try {
      const [accountData, transactionData] = await Promise.all([
        apiRequest('/api/accounts'),
        apiRequest('/api/transfers'),
      ])

      setAccounts(accountData)
      setTransactions(transactionData)

      setFromAccount((current) =>
        accountData.some((account) => account.accountNumber === current)
          ? current
          : accountData[0]?.accountNumber ?? '',
      )
      setToAccount((current) =>
        accountData.some((account) => account.accountNumber === current)
          ? current
          : accountData[1]?.accountNumber ?? '',
      )
    } catch (err) {
      setError(
        `تعذّر تحميل بيانات البنك. تأكد أن الـ Backend يعمل على المنفذ 8080. (${err.message})`,
      )
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadDashboard()
  }, [loadDashboard])

  const totalBalance = accounts.reduce(
    (total, account) => total + Number(account.balance ?? 0),
    0,
  )

  async function handleTransfer(event) {
    event.preventDefault()
    setError('')
    setNotice('')

    if (!fromAccount || !toAccount || fromAccount === toAccount) {
      setError('اختار حسابين مختلفين للتحويل.')
      return
    }

    const value = Number(amount)
    if (!Number.isFinite(value) || value < 0.01 || !/^\d+(\.\d{1,2})?$/.test(amount)) {
      setError('أدخل مبلغًا صحيحًا، بحد أقصى منزلتين عشريتين.')
      return
    }

    const source = accounts.find((account) => account.accountNumber === fromAccount)
    if (!source || value > Number(source.balance)) {
      setError('الرصيد المتاح غير كافٍ.')
      return
    }

    setSending(true)
    try {
      const result = await apiRequest('/api/transfers', {
        method: 'POST',
        body: JSON.stringify({
          fromAccountNumber: fromAccount,
          toAccountNumber: toAccount,
          amount: value.toFixed(2),
        }),
      })

      setNotice(`${result.message} — رقم العملية ${result.transactionId}`)
      setAmount('')
      await loadDashboard()
    } catch (err) {
      setError(`تعذّر تنفيذ التحويل: ${err.message}`)
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="#overview">
          <span className="brand-mark"><Landmark size={23} /></span>
          <span>bankflow<span className="brand-dot">.</span><small> DIGITAL BANKING</small></span>
        </a>

        <div className="nav-label">WORKSPACE</div>
        <nav className="navigation">
          <a className="nav-link active" href="#overview"><LayoutDashboard size={19} /> Overview</a>
          <a className="nav-link" href="#accounts"><Wallet size={19} /> My accounts</a>
          <a className="nav-link" href="#transfer"><ArrowLeftRight size={19} /> Transfers</a>
          <a className="nav-link" href="#activity"><Clock3 size={19} /> Transactions</a>
        </nav>

        <div className="sidebar-bottom">
          <div className="secure-card">
            <span className="secure-icon"><ShieldCheck size={19} /></span>
            <strong>Your money, in safe hands</strong>
            <p>BankFlow keeps your banking activity organized in one place.</p>
          </div>
          <div className="profile">
            <div className="avatar">BF</div>
            <div><strong>BankFlow Client</strong><small>Personal banking</small></div>
          </div>
        </div>
      </aside>

      <main className="main-content" id="overview">
        <header className="topbar">
          <div>
            <div className="eyebrow">PERSONAL BANKING</div>
            <h1>Good afternoon <span>👋</span></h1>
            <p className="subheading">Here’s what’s happening with your money.</p>
          </div>
          <div className="topbar-actions">
            <span className="connection"><span className="status-dot" /> Live account data</span>
            <button className="icon-button" onClick={loadDashboard} aria-label="Refresh data">
              <RefreshCw size={18} />
            </button>
            <button className="icon-button notification-button" aria-label="Notifications">
              <Bell size={18} />
              <span />
            </button>
          </div>
        </header>

        {error && <div className="alert error-alert" role="alert">{error}</div>}
        {notice && <div className="alert success-alert" role="status"><CheckCircle2 size={19} />{notice}</div>}

        <section className="summary-grid" aria-label="Account summary">
          <article className="balance-card">
            <div className="balance-card-top">
              <span>Total available balance</span>
              <span className="balance-icon"><Wallet size={20} /></span>
            </div>
            <div className="total-balance">{loading ? 'Loading…' : money(totalBalance)}</div>
            <div className="balance-footer"><span className="balance-indicator" /> Across {accounts.length} linked accounts</div>
            <div className="balance-decoration decoration-one" />
            <div className="balance-decoration decoration-two" />
          </article>

          <article className="stat-card">
            <div className="stat-heading"><span>Linked accounts</span><span className="stat-icon purple"><CreditCard size={19} /></span></div>
            <div className="stat-value">{loading ? '—' : accounts.length.toString().padStart(2, '0')}</div>
            <p className="stat-caption">Connected to your profile</p>
            <div className="stat-bottom"><span className="mini-bars"><i /><i /><i /><i /><i /><i /><i /></span><span>Account overview</span></div>
          </article>

          <article className="stat-card">
            <div className="stat-heading"><span>Recorded transfers</span><span className="stat-icon green"><ArrowLeftRight size={19} /></span></div>
            <div className="stat-value">{loading ? '—' : transactions.length.toString().padStart(2, '0')}</div>
            <p className="stat-caption">Transactions in your history</p>
            <div className="stat-bottom"><span className="transaction-dot" /><span>Stored in database</span></div>
          </article>
        </section>

        <section className="content-grid">
          <div className="panel accounts-panel" id="accounts">
            <div className="panel-header">
              <div><h2>Your accounts</h2><p>Manage your available balances</p></div>
              <span className="panel-count">{accounts.length} accounts</span>
            </div>

            {loading ? (
              <div className="loading-state"><LoaderCircle className="spin" size={22} /> Loading accounts…</div>
            ) : accounts.length === 0 ? (
              <div className="empty-state">No accounts found.</div>
            ) : (
              <div className="account-list">
                {accounts.map((account, index) => (
                  <article className="account-row" key={account.id}>
                    <div className={`account-symbol ${index % 2 ? 'symbol-lilac' : 'symbol-blue'}`}>
                      <Landmark size={21} />
                    </div>
                    <div className="account-details">
                      <strong>{account.accountHolder}</strong>
                      <span>{account.accountNumber}</span>
                    </div>
                    <div className="account-balance">
                      <strong>{money(account.balance)}</strong>
                      <span>{account.currency} · Available</span>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>

          <div className="panel transfer-panel" id="transfer">
            <div className="panel-header">
              <div><h2>Quick transfer</h2><p>Move money between accounts</p></div>
              <span className="transfer-heading-icon"><Send size={19} /></span>
            </div>

            <form className="transfer-form" onSubmit={handleTransfer}>
              <label htmlFor="from-account">From account</label>
              <select id="from-account" value={fromAccount} onChange={(event) => setFromAccount(event.target.value)} required disabled={loading || sending}>
                {accounts.map((account) => <option key={account.id} value={account.accountNumber}>{account.accountHolder} · {account.accountNumber}</option>)}
              </select>

              <div className="transfer-swap"><ArrowDownLeft size={17} /><span>TRANSFER TO</span></div>

              <label htmlFor="to-account">To account</label>
              <select id="to-account" value={toAccount} onChange={(event) => setToAccount(event.target.value)} required disabled={loading || sending}>
                {accounts.map((account) => <option key={account.id} value={account.accountNumber}>{account.accountHolder} · {account.accountNumber}</option>)}
              </select>

              <label htmlFor="amount">Transfer amount</label>
              <div className="amount-input">
                <span>EGP</span>
                <input id="amount" type="number" min="0.01" step="0.01" placeholder="0.00" value={amount} onChange={(event) => setAmount(event.target.value)} required disabled={loading || sending} />
              </div>

              {accounts.find((account) => account.accountNumber === fromAccount) && (
                <div className="available-balance">
                  <span>Available balance</span>
                  <strong>{money(accounts.find((account) => account.accountNumber === fromAccount).balance)}</strong>
                </div>
              )}

              <button className="submit-transfer" type="submit" disabled={loading || sending || accounts.length < 2}>
                {sending ? <><LoaderCircle className="spin" size={18} /> Processing transfer…</> : <>Confirm transfer <ArrowUpRight size={18} /></>}
              </button>
              <p className="form-footnote"><ShieldCheck size={14} /> Transfers are recorded in your transaction history.</p>
            </form>
          </div>
        </section>

        <section className="panel activity-panel" id="activity">
          <div className="panel-header activity-header">
            <div><h2>Recent transactions</h2><p>Your latest recorded account activity</p></div>
            <button className="text-button" onClick={loadDashboard}><RefreshCw size={15} /> Refresh</button>
          </div>

          {loading ? (
            <div className="loading-state"><LoaderCircle className="spin" size={22} /> Loading transactions…</div>
          ) : transactions.length === 0 ? (
            <div className="empty-state">No transactions recorded yet. Make your first transfer above.</div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead><tr><th>TRANSACTION</th><th>FROM ACCOUNT</th><th>TO ACCOUNT</th><th>DATE</th><th>AMOUNT</th><th>STATUS</th></tr></thead>
                <tbody>
                  {transactions.map((transaction) => (
                    <tr key={transaction.id}>
                      <td><span className="transaction-type"><span className="transaction-type-icon"><CircleDollarSign size={18} /></span><span><strong>Bank transfer</strong><small>TXN-{String(transaction.id).padStart(5, '0')}</small></span></span></td>
                      <td><span className="table-account">{transaction.fromAccountNumber}</span></td>
                      <td><span className="table-account">{transaction.toAccountNumber}</span></td>
                      <td><span className="table-date">{dateTime(transaction.createdAt)}</span></td>
                      <td><strong className="amount-value">− {money(transaction.amount)}</strong></td>
                      <td><span className="status-badge"><CheckCircle2 size={14} /> Recorded</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <footer className="page-footer">
          <span>© 2026 BankFlow. Demo banking application.</span>
          <span><span className="status-dot" /> Backend connection via Spring Boot API</span>
        </footer>
      </main>
    </div>
  )
}

export default App
