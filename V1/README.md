# 🐍 PyMon - Python Smart Contract Platform for Monad

[![Python](https://img.shields.io/badge/Python-3.8%2B-blue)](https://www.python.org/)
[![Monad](https://img.shields.io/badge/Blockchain-Monad-purple)](https://monad.xyz/)
[![Security](https://img.shields.io/badge/Security-Audited-green)](./AUDIT_GUIDE.md)
[![License](https://img.shields.io/badge/License-MIT-yellow)](./LICENSE)

**Write, Audit, and Deploy Smart Contracts in Pure Python - No Solidity Required!**

PyMon is a revolutionary smart contract development platform that lets you write blockchain applications in Python. It features a built-in security auditor, Python-to-EVM transpiler, and seamless deployment to Monad testnet.

## ✨ Key Features

- 🐍 **100% Python**: Write smart contracts in pure Python
- 🔍 **Built-in Security Auditor**: Automatic vulnerability detection before deployment
- ⚡ **Monad Optimized**: Deploy to Monad's high-performance blockchain
- 🔄 **Python to EVM**: Direct transpilation to EVM bytecode
- 💰 **Gas Optimization**: Smart gas estimation and optimization
- 🔐 **Secure Wallet**: Multiple wallet management options
- 🎨 **Beautiful CLI**: Rich terminal interface with colors and progress bars

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/pymon.git
cd pymon

# Install dependencies
pip install -r requirements.txt

# Setup environment
python -m pymon.cli env setup
```

## 🚀 Quick Start

### 1. Initialize a New Project

```bash
python -m pymon.cli init my_project
cd my_project
```

### 2. Write Your First Contract

Create `contracts/SimpleStorage.py`:

```python
from pymon.py_contracts import PySmartContract

class SimpleStorage(PySmartContract):
    def __init__(self):
        self.stored_value = 0
        self.owner = self.msg_sender()
    
    @public_function
    def set(self, value: int):
        """Store a value."""
        if value < 0:
            raise Exception("Value must be positive")
        self.stored_value = value
        self.event("ValueSet", self.msg_sender(), value)
    
    @view_function
    def get(self) -> int:
        """Retrieve the stored value."""
        return self.stored_value
```

### 3. Audit Your Contract

```bash
python -m pymon.cli audit contract SimpleStorage
```

Output:
```
🔍 Security Audit Report
Contract: SimpleStorage
Score: 95/100 ✅

Findings Summary
┏━━━━━━━━━━━━━┳━━━━━━━┓
┃ Severity    ┃ Count ┃
┡━━━━━━━━━━━━━╇━━━━━━━┩
│ 🔴 Critical │ 0     │
│ 🟠 High     │ 0     │
│ 🟡 Medium   │ 0     │
│ 🟢 Low      │ 1     │
└─────────────┴───────┘

✅ Contract passed security audit!
```

### 4. Compile Your Contract

```bash
python -m pymon.cli compile
```

### 5. Deploy to Monad Testnet

```bash
python -m pymon.cli deploy SimpleStorage
```

## 📚 Documentation

### Contract Development

PyMon contracts are written in pure Python using familiar syntax:

```python
class MyToken(PySmartContract):
    def __init__(self):
        self.name = "MyToken"
        self.symbol = "MTK"
        self.total_supply = 1000000
        self.balances = {}
        self.owner = self.msg_sender()
    
    @public_function
    def transfer(self, to: str, amount: int):
        """Transfer tokens to another address."""
        sender = self.msg_sender()
        
        if self.balances.get(sender, 0) < amount:
            raise Exception("Insufficient balance")
        
        self.balances[sender] -= amount
        self.balances[to] = self.balances.get(to, 0) + amount
        
        self.event("Transfer", sender, to, amount)
    
    @view_function
    def balance_of(self, account: str) -> int:
        """Get balance of an account."""
        return self.balances.get(account, 0)
```

### Available Decorators

- `@public_function` - Functions that modify state
- `@view_function` - Read-only functions
- `@payable` - Functions that can receive MON

### Built-in Functions

- `self.msg_sender()` - Get caller address
- `self.msg_value()` - Get sent value
- `self.block_timestamp()` - Current block timestamp
- `self.event(name, *args)` - Emit an event

## 🔍 Security Auditor

PyMon includes a comprehensive security auditor that checks for:

### Vulnerability Detection

- **Critical Issues**
  - Reentrancy attacks
  - Unprotected critical functions
  
- **High Severity**
  - Missing access control
  - Integer overflow/underflow
  - Denial of Service vulnerabilities
  
- **Medium Severity**
  - Timestamp dependence
  - Unsafe randomness
  - Gas limit issues
  
- **Low Severity**
  - Missing input validation
  - Hardcoded values
  - Gas optimization opportunities

### Audit Commands

```bash
# Audit single contract
python -m pymon.cli audit contract MyContract

# Audit all contracts
python -m pymon.cli audit all

# Save audit report
python -m pymon.cli audit contract MyContract --output report.json
```

## 🛠️ CLI Commands

### Project Management

```bash
# Initialize new project
python -m pymon.cli init <project_name>

# Show project info
python -m pymon.cli info
```

### Contract Operations

```bash
# Compile contracts
python -m pymon.cli compile

# Deploy contract
python -m pymon.cli deploy <contract_name>

# Interact with deployed contract
python -m pymon.cli interact <contract_name>

# Estimate gas
python -m pymon.cli estimate <contract_name>
```

### Wallet Management

```bash
# Create new wallet
python -m pymon.cli wallet new

# Show wallet info
python -m pymon.cli wallet info

# Export wallet
python -m pymon.cli wallet export
```

### Environment Setup

```bash
# Setup environment
python -m pymon.cli env setup

# Show environment status
python -m pymon.cli env status
```

## 🌐 Network Configuration

PyMon is configured for Monad Testnet by default:

- **Network**: Monad Testnet
- **Chain ID**: 10143
- **RPC URL**: https://testnet-rpc.monad.xyz/
- **Explorer**: https://testnet.monadexplorer.com/

### Custom Configuration

Edit `pymon_config.json`:

```json
{
  "network": "monad-testnet",
  "chain_id": 10143,
  "rpc_url": "https://testnet-rpc.monad.xyz/",
  "explorer_url": "https://testnet.monadexplorer.com"
}
```

## 🔐 Security Best Practices

1. **Always Audit Before Deployment**
   ```bash
   python -m pymon.cli audit contract MyContract
   ```

2. **Use Access Control**
   ```python
   def only_owner(self):
       if self.msg_sender() != self.owner:
           raise Exception("Not authorized")
   ```

3. **Validate Inputs**
   ```python
   def transfer(self, to: str, amount: int):
       if amount <= 0:
           raise Exception("Invalid amount")
       if not to:
           raise Exception("Invalid recipient")
   ```

4. **Follow Checks-Effects-Interactions Pattern**
   ```python
   def withdraw(self, amount: int):
       # Checks
       if self.balances[self.msg_sender()] < amount:
           raise Exception("Insufficient balance")
       
       # Effects
       self.balances[self.msg_sender()] -= amount
       
       # Interactions
       self.transfer_mon(self.msg_sender(), amount)
   ```

## 📊 Example Projects

### 1. Voting Contract

```python
class VotingContract(PySmartContract):
    def __init__(self):
        self.admin = self.msg_sender()
        self.candidates = []
        self.votes = {}
        self.has_voted = {}
    
    @public_function
    def add_candidate(self, name: str):
        if self.msg_sender() != self.admin:
            raise Exception("Only admin")
        self.candidates.append(name)
    
    @public_function
    def vote(self, candidate: str):
        voter = self.msg_sender()
        if self.has_voted.get(voter):
            raise Exception("Already voted")
        if candidate not in self.candidates:
            raise Exception("Invalid candidate")
        
        self.votes[candidate] = self.votes.get(candidate, 0) + 1
        self.has_voted[voter] = True
        self.event("VoteCast", voter, candidate)
```

### 2. Token Contract

```python
class PyToken(PySmartContract):
    def __init__(self):
        self.name = "PyToken"
        self.symbol = "PYT"
        self.decimals = 18
        self.total_supply = 1000000 * 10**18
        self.balances = {self.msg_sender(): self.total_supply}
    
    @public_function
    def transfer(self, to: str, amount: int):
        self._transfer(self.msg_sender(), to, amount)
    
    def _transfer(self, from_addr: str, to: str, amount: int):
        if self.balances.get(from_addr, 0) < amount:
            raise Exception("Insufficient balance")
        
        self.balances[from_addr] -= amount
        self.balances[to] = self.balances.get(to, 0) + amount
        self.event("Transfer", from_addr, to, amount)
```

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

### Development Setup

```bash
# Clone repo
git clone https://github.com/yourusername/pymon.git

# Install in development mode
pip install -e .

# Run tests
pytest tests/
```

## 📝 License

MIT License - see [LICENSE](./LICENSE) file for details.

## 🆘 Support

- **Documentation**: [docs.pymon.dev](https://docs.pymon.dev)
- **Discord**: [Join our community](https://discord.gg/pymon)
- **Issues**: [GitHub Issues](https://github.com/yourusername/pymon/issues)

## 🎯 Roadmap

- [x] Python to EVM transpiler
- [x] Security auditor
- [x] Monad testnet support
- [x] Wallet management
- [x] Gas optimization
- [ ] Mainnet support
- [ ] VSCode extension
- [ ] Web IDE
- [ ] Advanced debugging tools
- [ ] Formal verification

## 🙏 Acknowledgments

- Monad Labs for the amazing blockchain
- Python community for the inspiration
- All contributors and testers

---

**Built with ❤️ by the PyMon Team**

*Making Smart Contracts Pythonic!* 🐍✨
