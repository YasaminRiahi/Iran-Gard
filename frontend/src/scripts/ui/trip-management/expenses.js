import { state } from './core.js';
import {
    getTripExpenses,
    createExpense,
    updateExpense as updateExpenseAPI,
    deleteExpense as deleteExpenseAPI,
    getSettlement
} from '/src/scripts/services/trips-service.js';
import { englishToPersianNumber } from './utils.js';

let editingExpenseId = null;

export function renderExpenses() {
    const expensesList = document.getElementById('expensesList');

    if (state.expenses.length === 0) {
        expensesList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-wallet"></i>
                <h3>هنوز هزینه‌ای ثبت نشده</h3>
                <p>برای ثبت هزینه، روی دکمه "ثبت هزینه جدید" کلیک کنید</p>
            </div>
        `;
        updateExpensesSummary();
        return;
    }

    const categoryIcons = {
        food: 'fa-utensils',
        transport: 'fa-car',
        accommodation: 'fa-bed',
        entertainment: 'fa-ticket-alt',
        shopping: 'fa-shopping-bag',
        other: 'fa-ellipsis-h'
    };

    const categoryNames = {
        food: 'غذا',
        transport: 'حمل‌ونقل',
        accommodation: 'اقامت',
        entertainment: 'سرگرمی',
        shopping: 'خرید',
        other: 'سایر'
    };

    expensesList.innerHTML = state.expenses.map(expense => {
        const payer = state.tripData.participants.find(p => p.id === expense.payerId);
        const participantNames = expense.participants.map(p => {
            const participant = state.tripData.participants.find(part => part.id === p.id);
            return participant ? `${participant.username} (${englishToPersianNumber(p.share.toLocaleString())}تومان)` : '';
        }).filter(Boolean).join('، ');

        return `
            <div class="expense-item">
                <div class="expense-category-icon ${expense.category}">
                    <i class="fas ${categoryIcons[expense.category]}"></i>
                </div>
                <div class="expense-details">
                    <div class="expense-description">${expense.description}</div>
                    <div class="expense-meta">
                        <span class="expense-meta-item">
                            <i class="fas fa-tag"></i> ${categoryNames[expense.category]}
                        </span>
                        <span class="expense-meta-item">
                            <i class="fas fa-user"></i> ${payer ? payer.username : 'نامشخص'}
                        </span>
                        <span class="expense-meta-item" style="max-width: 400px; white-space: normal;">
                            <i class="fas fa-users"></i> ${participantNames}
                        </span>
                    </div>
                </div>
                <div class="expense-amount">
                    ${englishToPersianNumber(expense.amount.toLocaleString())} تومان
                </div>
                ${state.isOwner ? `
                <div class="expense-actions">
                    <button class="btn-edit-expense" onclick="window.editExpense(${expense.id})" title="ویرایش">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-delete-expense" onclick="window.deleteExpense(${expense.id})" title="حذف">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
                ` : ''}
            </div>            
        `;
    }).join('');

    updateExpensesSummary();
    calculateSettlement();
}

function updateExpensesSummary() {
    const totalExpense = state.expenses.reduce((sum, exp) => sum + exp.amount, 0);
    document.getElementById('totalExpense').textContent = `${englishToPersianNumber(totalExpense.toLocaleString())} تومان`;
}

async function calculateSettlement() {
    const settlementList = document.getElementById('settlementList');

    if (state.expenses.length === 0) {
        settlementList.innerHTML = '<p style="text-align: center; color: #9ca3af;">هزینه‌ای برای تسویه وجود ندارد</p>';
        return;
    }

    try {
        const response = await getSettlement(state.TRIP_ID);
        const data = response.data || response;

        let settlements = [];

        if (Array.isArray(data)) {
            settlements = data;
            state.settlements = settlements;
        } else if (data.settlements && Array.isArray(data.settlements)) {
            settlements = data.settlements;
            state.settlements = settlements;
        } else {
            settlementList.innerHTML = '<p style="text-align: center; color: #f5c9b0;">خطا در دریافت تسویه</p>';
            return;
        }

        if (settlements.length === 0) {
            settlementList.innerHTML = '<p style="text-align: center; color: #A6B28B; font-weight: 600;">✓ همه حساب‌ها تسویه است!</p>';
            return;
        }

        settlementList.innerHTML = settlements.map(s => {
            const fromName = `کاربر ${s.from_name}`;
            const toName = `کاربر ${s.to_name}`;

            return `
                <div class="settlement-item">
                    <p>
                        <strong>${fromName}</strong> باید 
                        <strong style="font-size: 1.2rem;">${englishToPersianNumber(Math.round(s.amount).toLocaleString())} تومان</strong> 
                        به <strong>${toName}</strong> بدهد
                    </p>
                </div>
            `;
        }).join('');

    } catch (error) {
        console.error('خطا در تسویه:', error);
        settlementList.innerHTML = '<p style="text-align: center; color: #f5c9b0;">خطا در محاسبه تسویه</p>';
    }
}

// Edit Expense
function editExpense(expenseId) {
    const expense = state.expenses.find(e => e.id === expenseId);
    if (!expense) return;

    editingExpenseId = expenseId;
    addExpenseModal.classList.add('active');
    initExpenseModal();

    document.getElementById('expenseCategory').value = expense.category;
    document.getElementById('expenseDescription').value = expense.description;
    document.getElementById('expenseAmount').value = expense.amount;
    document.getElementById('expensePayer').value = expense.payerId;

    expense.participants.forEach(p => {
        const checkbox = document.querySelector(`#expenseParticipants input[value="${p.id}"]`);
        const shareInput = document.getElementById(`share-${p.id}`);
        if (checkbox && shareInput) {
            checkbox.checked = true;
            shareInput.value = p.share;
            shareInput.disabled = false;
        }
    });

    state.tripData.participants.forEach(p => {
        if (!expense.participants.find(ep => ep.id === p.id)) {
            const checkbox = document.querySelector(`#expenseParticipants input[value="${p.id}"]`);
            const shareInput = document.getElementById(`share-${p.id}`);
            if (checkbox && shareInput) {
                checkbox.checked = false;
                shareInput.value = '0';
                shareInput.disabled = true;
            }
        }
    });

    const saveBtn = document.getElementById('saveExpenseBtn');
    saveBtn.innerHTML = '<i class="fas fa-save"></i> ویرایش هزینه';
}

// Delete Expense
async function deleteExpense(expenseId) {
    const expense = state.expenses.find(e => e.id === expenseId);

    const result = await Swal.fire({
        text: `آیا مطمئن هستید که می‌خواهید هزینه "${expense.description}" را حذف کنید؟`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'بله، حذف کن',
        cancelButtonText: 'انصراف',
        cancelButtonColor: '#A6B28B',
        confirmButtonColor: '#f5c9b0',
        background: '#f0f0f0',
        customClass: {
            popup: 'my-swal-popup',
            confirmButton: 'my-confirm-btn',
            cancelButton: 'my-cancel-btn'
        }
    });

    if (result.isConfirmed) {
        try {
            await deleteExpenseAPI(state.TRIP_ID, expenseId);

            const index = state.expenses.findIndex(e => e.id === expenseId);
            state.expenses.splice(index, 1);

            Swal.fire({
                icon: 'success',
                text: 'هزینه با موفقیت حذف شد',
                timer: 2000,
                confirmButtonText : 'باشه',
                confirmButtonColor: '#A6B28B',
                cancelButtonColor: '#f5c9b0',
                background: '#f0f0f0',
                customClass: {
                    popup: 'my-swal-popup',
                    confirmButton: 'my-confirm-btn',
                    cancelButton: 'my-cancel-btn'
                }
            });

            renderExpenses();

        } catch (error) {
            console.error('خطا:', error);
            Swal.fire({
                icon: 'error',
                title: 'خطا در حذف هزینه',
                confirmButtonText : 'باشه',
                confirmButtonColor: '#A6B28B',
                cancelButtonColor: '#f5c9b0',
                background: '#f0f0f0',
                customClass: {
                    popup: 'my-swal-popup',
                    confirmButton: 'my-confirm-btn',
                    cancelButton: 'my-cancel-btn'
                }
            });
        }
    }
}

// Add Expense Modal
const addExpenseModal = document.getElementById('addExpenseModal');
const addExpenseBtn = document.getElementById('addExpenseBtn');
const closeExpenseModal = document.getElementById('closeExpenseModal');

addExpenseBtn?.addEventListener('click', () => {
    addExpenseModal.classList.add('active');
    initExpenseModal();
});

closeExpenseModal?.addEventListener('click', () => {
    editingExpenseId = null;
    addExpenseModal.classList.remove('active');
    const saveBtn = document.getElementById('saveExpenseBtn');
    saveBtn.innerHTML = '<i class="fas fa-check"></i> ثبت هزینه';
});

window.addEventListener('click', (e) => {
    if (e.target === addExpenseModal) {
        addExpenseModal.classList.remove('active');
    }
});

function initExpenseModal() {
    const payerSelect = document.getElementById('expensePayer');
    payerSelect.innerHTML = state.tripData.participants.map(p =>
        `<option value="${p.id}">${p.username}</option>`
    ).join('');

    const participantsDiv = document.getElementById('expenseParticipants');
    participantsDiv.innerHTML = state.tripData.participants.map(p => `
    <label>
        <div>
            <input type="checkbox" value="${p.id}" checked>
            <span>${p.username}</span>
        </div>
        <input type="number" 
               class="participant-share-input"
               placeholder="سهم (تومان)" 
               style="width: 100%; padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 6px;">
    </label>
    `).join('');

    document.getElementById('expenseCategory').value = 'food';
    document.getElementById('expenseDescription').value = '';
    document.getElementById('expenseAmount').value = '';
}

function toggleParticipantShare(participantId) {
    const checkbox = document.querySelector(`#expenseParticipants input[value="${participantId}"]`);
    const shareInput = document.getElementById(`share-${participantId}`);

    if (!checkbox.checked) {
        shareInput.value = '0';
        shareInput.disabled = true;
    } else {
        shareInput.disabled = false;
    }
}

// Save Expense
document.getElementById('saveExpenseBtn')?.addEventListener('click', async () => {
    const category = document.getElementById('expenseCategory').value;
    const description = document.getElementById('expenseDescription').value;
    const amount = parseInt(document.getElementById('expenseAmount').value);
    const payerId = parseInt(document.getElementById('expensePayer').value);

    const participantCheckboxes = document.querySelectorAll('#expenseParticipants input[type="checkbox"]:checked');
    const participantsData = [];
    let totalShares = 0;

    participantCheckboxes.forEach(cb => {
        const pId = parseInt(cb.value);
        const share = parseInt(document.getElementById(`share-${pId}`).value) || 0;
        if (share > 0) {
            participantsData.push({user_id: pId, share: share});
            totalShares += share;
        }
    });

    if (!description || !amount || amount <= 0) {
        Swal.fire({
            icon: 'warning',
            text: 'لطفاً تمام فیلدها را به درستی پر کنید',
            confirmButtonText : 'باشه',
            confirmButtonColor: '#A6B28B',
            cancelButtonColor: '#f5c9b0',
            background: '#f0f0f0',
            customClass: {
                popup: 'my-swal-popup',
                confirmButton: 'my-confirm-btn',
                cancelButton: 'my-cancel-btn'
            }
        });
        return;
    }

    if (participantsData.length === 0) {
        Swal.fire({
            icon: 'warning',
            text: 'حداقل یک نفر با سهم مشخص باید انتخاب شود',
            confirmButtonText : 'باشه',
            confirmButtonColor: '#A6B28B',
            cancelButtonColor: '#f5c9b0',
            background: '#f0f0f0',
            customClass: {
                popup: 'my-swal-popup',
                confirmButton: 'my-confirm-btn',
                cancelButton: 'my-cancel-btn'
            }
        });
        return;
    }

    if (totalShares !== amount) {
        Swal.fire({
            icon: 'warning',
            text: `مجموع سهم‌ها (${totalShares.toLocaleString()}) با مبلغ کل (${amount.toLocaleString()}) برابر نیست!`,
            confirmButtonText : 'باشه',
            confirmButtonColor: '#A6B28B',
            cancelButtonColor: '#f5c9b0',
            background: '#f0f0f0',
            customClass: {
                popup: 'my-swal-popup',
                confirmButton: 'my-confirm-btn',
                cancelButton: 'my-cancel-btn'
            }
        });
        return;
    }

    try {
        const expensePayload = {
            category: category,
            description: description,
            amount: amount,
            payer_id: payerId,
            participants: participantsData
        };

        if (editingExpenseId !== null) {
            // ویرایش
            const response = await updateExpenseAPI(state.TRIP_ID, editingExpenseId, expensePayload);
            const updatedExpense = response.data || response;

            const expenseIndex = state.expenses.findIndex(e => e.id === editingExpenseId);
            state.expenses[expenseIndex] = {
                id: updatedExpense.expense_id,
                category: updatedExpense.category,
                description: updatedExpense.description,
                amount: updatedExpense.amount,
                payerId: updatedExpense.payer_id,
                participants: updatedExpense.participants.map(p => ({
                    id: p.user_id,
                    share: p.share
                })),
                createdAt: updatedExpense.created_at
            };

            Swal.fire({
                icon: 'success',
                title: 'هزینه ویرایش شد',
                confirmButtonText : 'باشه',
                confirmButtonColor: '#A6B28B',
                cancelButtonColor: '#f5c9b0',
                background: '#f0f0f0',
                customClass: {
                    popup: 'my-swal-popup',
                    confirmButton: 'my-confirm-btn',
                    cancelButton: 'my-cancel-btn'
                },
                timer: 2000
            });
        } else {
            // ایجاد جدید
            const response = await createExpense(state.TRIP_ID, expensePayload);
            const createdExpense = response.data || response;

            state.expenses.push({
                id: createdExpense.expense_id,
                category: createdExpense.category,
                description: createdExpense.description,
                amount: createdExpense.amount,
                payerId: createdExpense.payer_id,
                participants: createdExpense.participants.map(p => ({
                    id: p.user_id,
                    share: p.share
                })),
                createdAt: createdExpense.created_at
            });

            Swal.fire({
                icon: 'success',
                text: `هزینه "${description}" با موفقیت ثبت شد`,
                confirmButtonText : 'باشه',
                confirmButtonColor: '#A6B28B',
                cancelButtonColor: '#f5c9b0',
                background: '#f0f0f0',
                customClass: {
                    popup: 'my-swal-popup',
                    confirmButton: 'my-confirm-btn',
                    cancelButton: 'my-cancel-btn'
                },
                timer: 2000
            });
        }

        editingExpenseId = null;
        addExpenseModal.classList.remove('active');
        renderExpenses();

        const saveBtn = document.getElementById('saveExpenseBtn');
        saveBtn.innerHTML = '<i class="fas fa-check"></i> ثبت هزینه';

    } catch (error) {
        console.error('خطا:', error);
        Swal.fire({
            icon: 'error',
            title: 'خطا در ثبت هزینه',
            text: error.response?.data?.detail || 'مشکلی پیش آمد',
            confirmButtonText : 'باشه',
            confirmButtonColor: '#A6B28B',
            cancelButtonColor: '#f5c9b0',
            background: '#f0f0f0',
            customClass: {
                popup: 'my-swal-popup',
                confirmButton: 'my-confirm-btn',
                cancelButton: 'my-cancel-btn'
            }
        });
    }
});

// Export to window
window.editExpense = editExpense;
window.deleteExpense = deleteExpense;
window.toggleParticipantShare = toggleParticipantShare;