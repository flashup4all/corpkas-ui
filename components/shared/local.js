import React from 'react'

export const storeUser = (user) => localStorage.setItem('kutk', JSON.stringify(user))
export const getUser = () => JSON.parse(localStorage.getItem('kutk'))
export const storeToken = (token) => localStorage.setItem('katk', token)
export const getToken = () => localStorage.getItem('katk')
export const storeMember = (member) => localStorage.setItem('kmtk', JSON.stringify(member))
export const getMember = () => JSON.parse(window.localStorage.getItem('kmtk'))
export const storeStaff = (staff) => localStorage.setItem('kstk', JSON.stringify(staff))
export const getStaff = () => JSON.parse(window.localStorage.getItem('kstk'))
export const storeVendor = (vendor) => localStorage.setItem('kvtk', JSON.stringify(vendor))
export const getVendor = () => JSON.parse(window.localStorage.getItem('kvtk'))

export const clearStorage = () => {
    localStorage.removeItem('kutk')
    localStorage.removeItem('katk')
    localStorage.removeItem('kvtk')
    localStorage.removeItem('kmtk')
    localStorage.removeItem('kstk')
}
