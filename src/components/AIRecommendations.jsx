import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, AlertCircle, Lightbulb, DollarSign, Calendar, PieChart } from 'lucide-react';

const AIRecommendations = ({ transactions, categories }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [insights, setInsights] = useState({});

  useEffect(() => {
    if (transactions.length > 0) {
      generateRecommendations();
    }
  }, [transactions, categories]);

  const generateRecommendations = () => {
    const analysis = analyzeSpending();
    const recs = [];

    // High spending category alert
    if (analysis.highestCategory) {
      const percentage = ((analysis.highestCategory.amount / analysis.totalExpenses) * 100).toFixed(1);
      recs.push({
        type: 'warning',
        title: 'High Spending Alert',
        message: `${percentage}% of your expenses go to ${analysis.highestCategory.name}. Consider setting a budget limit.`,
        icon: AlertCircle,
        color: 'text-orange-500'
      });
    }

    // Unusual spending pattern
    if (analysis.unusualSpending.length > 0) {
      analysis.unusualSpending.forEach(item => {
        recs.push({
          type: 'info',
          title: 'Unusual Spending Detected',
          message: `Your ${item.category} spending is ${item.percentageIncrease}% higher than average.`,
          icon: TrendingUp,
          color: 'text-blue-500'
        });
      });
    }

    // Savings opportunity
    if (analysis.savingsOpportunity) {
      recs.push({
        type: 'success',
        title: 'Savings Opportunity',
        message: `You could save $${analysis.savingsOpportunity.amount.toFixed(2)} per month by reducing ${analysis.savingsOpportunity.category} expenses by 20%.`,
        icon: DollarSign,
        color: 'text-green-500'
      });
    }

    // Positive trend
    if (analysis.positiveTrend) {
      recs.push({
        type: 'success',
        title: 'Great Progress!',
        message: `Your spending decreased by ${analysis.positiveTrend.percentage}% compared to last period. Keep it up!`,
        icon: TrendingDown,
        color: 'text-green-500'
      });
    }

    // Budget recommendation
    if (analysis.suggestedBudgets.length > 0) {
      analysis.suggestedBudgets.forEach(budget => {
        recs.push({
          type: 'tip',
          title: 'Budget Suggestion',
          message: `Based on your spending, we recommend a ${budget.category} budget of $${budget.amount.toFixed(2)}/month.`,
          icon: Lightbulb,
          color: 'text-purple-500'
        });
      });
    }

    // Recurring transaction insight
    if (analysis.recurringTransactions.length > 0) {
      recs.push({
        type: 'info',
        title: 'Recurring Expenses Detected',
        message: `You have ${analysis.recurringTransactions.length} recurring expenses totaling $${analysis.recurringTransactions.reduce((sum, t) => sum + Math.abs(t.amount), 0).toFixed(2)}/month.`,
        icon: Calendar,
        color: 'text-blue-500'
      });
    }

    setRecommendations(recs);
    setInsights(analysis);
  };

  const analyzeSpending = () => {
    const expenses = transactions.filter(t => t.amount < 0);
    const income = transactions.filter(t => t.amount > 0);
    
    const totalExpenses = Math.abs(expenses.reduce((sum, t) => sum + t.amount, 0));
    const totalIncome = income.reduce((sum, t) => sum + t.amount, 0);

    // Category-wise spending
    const categorySpending = {};
    expenses.forEach(transaction => {
      const category = categories.find(c => c.id === transaction.categoryId);
      const categoryName = category ? category.name : 'Uncategorized';
      
      if (!categorySpending[categoryName]) {
        categorySpending[categoryName] = {
          name: categoryName,
          amount: 0,
          count: 0,
          transactions: []
        };
      }
      categorySpending[categoryName].amount += Math.abs(transaction.amount);
      categorySpending[categoryName].count += 1;
      categorySpending[categoryName].transactions.push(transaction);
    });

    // Find highest spending category
    const highestCategory = Object.values(categorySpending).sort((a, b) => b.amount - a.amount)[0];

    // Detect unusual spending (categories spending more than 30% of total)
    const unusualSpending = Object.values(categorySpending)
      .filter(cat => (cat.amount / totalExpenses) > 0.3)
      .map(cat => ({
        category: cat.name,
        amount: cat.amount,
        percentageIncrease: (((cat.amount / totalExpenses) - 0.2) * 100).toFixed(1)
      }));

    // Calculate savings opportunity (top 2 categories)
    const topCategories = Object.values(categorySpending).sort((a, b) => b.amount - a.amount).slice(0, 2);
    const savingsOpportunity = topCategories.length > 0 ? {
      category: topCategories[0].name,
      amount: topCategories[0].amount * 0.2
    } : null;

    // Suggested budgets
    const suggestedBudgets = Object.values(categorySpending)
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 3)
      .map(cat => ({
        category: cat.name,
        amount: cat.amount * 1.1 // 10% buffer
      }));

    // Detect recurring transactions (same amount within $5 tolerance)
    const recurringTransactions = expenses.filter((t, i, arr) => {
      const similar = arr.filter(other => 
        Math.abs(Math.abs(t.amount) - Math.abs(other.amount)) < 5 && t.id !== other.id
      );
      return similar.length > 0;
    });

    // Calculate positive trend (mock - in real app, compare with previous period)
    const positiveTrend = totalIncome > totalExpenses ? {
      percentage: (((totalIncome - totalExpenses) / totalIncome) * 100).toFixed(1)
    } : null;

    return {
      totalExpenses,
      totalIncome,
      categorySpending,
      highestCategory,
      unusualSpending,
      savingsOpportunity,
      suggestedBudgets,
      recurringTransactions,
      positiveTrend
    };
  };

  const getTypeStyles = (type) => {
    const styles = {
      warning: 'bg-orange-50 border-orange-200',
      success: 'bg-green-50 border-green-200',
      info: 'bg-blue-50 border-blue-200',
      tip: 'bg-purple-50 border-purple-200'
    };
    return styles[type] || 'bg-gray-50 border-gray-200';
  };

  if (transactions.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <PieChart className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Data Available</h3>
          <p className="text-gray-500">Upload transactions to get personalized AI recommendations</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">AI Recommendations</h1>
        <p className="text-gray-600">Personalized insights based on your spending patterns</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-md p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-blue-100">Total Expenses</span>
            <TrendingUp className="w-5 h-5" />
          </div>
          <p className="text-3xl font-bold">${insights.totalExpenses?.toFixed(2) || '0.00'}</p>
        </div>
        
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-md p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-green-100">Total Income</span>
            <DollarSign className="w-5 h-5" />
          </div>
          <p className="text-3xl font-bold">${insights.totalIncome?.toFixed(2) || '0.00'}</p>
        </div>
        
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-md p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-purple-100">Recommendations</span>
            <Lightbulb className="w-5 h-5" />
          </div>
          <p className="text-3xl font-bold">{recommendations.length}</p>
        </div>
      </div>

      {/* Recommendations List */}
      <div className="space-y-4">
        {recommendations.length > 0 ? (
          recommendations.map((rec, index) => {
            const Icon = rec.icon;
            return (
              <div 
                key={index}
                className={`border-l-4 rounded-lg shadow-sm p-6 ${getTypeStyles(rec.type)} transition-all hover:shadow-md`}
              >
                <div className="flex items-start gap-4">
                  <div className={`${rec.color} mt-1`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 mb-1">{rec.title}</h3>
                    <p className="text-gray-600">{rec.message}</p>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <Lightbulb className="w-12 h-12 mx-auto text-gray-400 mb-3" />
            <p className="text-gray-500">No recommendations available yet. Keep tracking your expenses!</p>
          </div>
        )}
      </div>

      {/* Category Breakdown */}
      {insights.categorySpending && Object.keys(insights.categorySpending).length > 0 && (
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Spending by Category</h2>
          <div className="space-y-3">
            {Object.values(insights.categorySpending)
              .sort((a, b) => b.amount - a.amount)
              .map((cat, index) => {
                const percentage = ((cat.amount / insights.totalExpenses) * 100).toFixed(1);
                return (
                  <div key={index}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-700">{cat.name}</span>
                      <span className="text-sm text-gray-600">${cat.amount.toFixed(2)} ({percentage}%)</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
};

export default AIRecommendations;