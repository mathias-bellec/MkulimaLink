const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');

const SWAHILI_COMMANDS = {
  'tafuta': 'search',
  'nunua': 'buy',
  'uza': 'sell',
  'bei': 'price',
  'hali ya hewa': 'weather',
  'akaunti': 'account',
  'malipo': 'payment',
  'orodha': 'list'
};

const PRODUCT_CATEGORIES_SW = {
  'nafaka': 'grains',
  'mboga': 'vegetables',
  'matunda': 'fruits',
  'mifugo': 'livestock',
  'maziwa': 'dairy'
};

router.post('/command', protect, async (req, res) => {
  try {
    const { text, language = 'sw' } = req.body;
    const lowerText = text.toLowerCase();

    let command = null;
    let params = {};

    for (const [swahili, english] of Object.entries(SWAHILI_COMMANDS)) {
      if (lowerText.includes(swahili)) {
        command = english;
        break;
      }
    }

    if (!command) {
      return res.json({
        success: false,
        message: language === 'sw' 
          ? 'Samahani, sijaelewa amri yako. Jaribu tena.'
          : 'Sorry, I did not understand your command. Please try again.',
        suggestions: language === 'sw'
          ? ['Tafuta mahindi', 'Nunua nyanya', 'Hali ya hewa', 'Akaunti yangu']
          : ['Search maize', 'Buy tomatoes', 'Weather', 'My account']
      });
    }

    let response = {};

    switch (command) {
      case 'search':
        for (const [swahili, category] of Object.entries(PRODUCT_CATEGORIES_SW)) {
          if (lowerText.includes(swahili)) {
            params.category = category;
            break;
          }
        }

        const products = await Product.find({
          status: 'active',
          ...(params.category && { category: params.category })
        })
        .populate('seller', 'name location')
        .limit(5);

        response = {
          success: true,
          command: 'search',
          message: language === 'sw'
            ? `Nimepata bidhaa ${products.length}`
            : `Found ${products.length} products`,
          data: products,
          voiceResponse: language === 'sw'
            ? `Nimepata bidhaa ${products.length}. ${products.map((p, i) => 
                `Namba ${i + 1}: ${p.name}, bei shilingi ${p.price}`
              ).join('. ')}`
            : `Found ${products.length} products. ${products.map((p, i) => 
                `Number ${i + 1}: ${p.name}, price ${p.price} shillings`
              ).join('. ')}`
        };
        break;

      case 'weather':
        response = {
          success: true,
          command: 'weather',
          message: language === 'sw'
            ? 'Ninakupelekea kwenye hali ya hewa'
            : 'Redirecting to weather',
          redirect: '/weather'
        };
        break;

      case 'account':
        response = {
          success: true,
          command: 'account',
          message: language === 'sw'
            ? `Akaunti yako: ${req.user.name}. Salio: ${req.user.balance} shilingi`
            : `Your account: ${req.user.name}. Balance: ${req.user.balance} shillings`,
          data: {
            name: req.user.name,
            balance: req.user.balance,
            role: req.user.role
          },
          voiceResponse: language === 'sw'
            ? `Jina lako ni ${req.user.name}. Salio lako ni shilingi ${req.user.balance}`
            : `Your name is ${req.user.name}. Your balance is ${req.user.balance} shillings`
        };
        break;

      case 'list':
        response = {
          success: true,
          command: 'list',
          message: language === 'sw'
            ? 'Ninakupelekea kwenye orodha ya bidhaa zako'
            : 'Redirecting to your product listings',
          redirect: '/dashboard'
        };
        break;

      default:
        response = {
          success: true,
          command,
          message: language === 'sw'
            ? `Amri "${command}" imepokelewa`
            : `Command "${command}" received`
        };
    }

    res.json(response);
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
});

router.get('/help', (req, res) => {
  const { language = 'sw' } = req.query;

  const commands = language === 'sw' ? {
    'Tafuta [bidhaa]': 'Tafuta bidhaa unazotaka kununua',
    'Nunua [bidhaa]': 'Nunua bidhaa',
    'Uza [bidhaa]': 'Weka bidhaa kwenye soko',
    'Bei ya [bidhaa]': 'Angalia bei za soko',
    'Hali ya hewa': 'Angalia hali ya hewa',
    'Akaunti yangu': 'Angalia taarifa za akaunti yako',
    'Malipo': 'Angalia malipo yako',
    'Orodha yangu': 'Angalia bidhaa zako'
  } : {
    'Search [product]': 'Search for products to buy',
    'Buy [product]': 'Purchase a product',
    'Sell [product]': 'List a product for sale',
    'Price of [product]': 'Check market prices',
    'Weather': 'Check weather forecast',
    'My account': 'View your account information',
    'Payments': 'View your payments',
    'My listings': 'View your product listings'
  };

  res.json({
    language,
    commands,
    examples: language === 'sw' 
      ? ['Tafuta mahindi', 'Bei ya nyanya', 'Hali ya hewa Arusha', 'Akaunti yangu']
      : ['Search maize', 'Price of tomatoes', 'Weather in Arusha', 'My account']
  });
});

module.exports = router;
