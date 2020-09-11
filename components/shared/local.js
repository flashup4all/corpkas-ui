import React from 'react'
import {TOKEN, VENDOR, USER, MEMBER, STAFF} from './constant'
import { ST } from 'next/dist/next-server/lib/utils'
export const storeUser = (user) => localStorage.setItem(USER, JSON.stringify(user))
export const getUser = () => JSON.parse(localStorage.getItem(USER))
export const storeToken = (token) => localStorage.setItem(TOKEN, token)
export const getToken = () => localStorage.getItem(TOKEN)
export const storeMember = (member) => localStorage.setItem(MEMBER, JSON.stringify(member))
export const getMember = () => JSON.parse(window.localStorage.getItem(MEMBER))
export const storeStaff = (staff) => localStorage.setItem(STAFF, JSON.stringify(staff))
export const getStaff = () => JSON.parse(window.localStorage.getItem(STAFF))
export const storeVendor = (vendor) => localStorage.setItem(VENDOR, JSON.stringify(vendor))
export const getVendor = () => JSON.parse(window.localStorage.getItem(VENDOR))

export const clearStorage = () => {
    localStorage.removeItem(USER)
    localStorage.removeItem(TOKEN)
    localStorage.removeItem(VENDOR)
    localStorage.removeItem(MEMBER)
    localStorage.removeItem(STAFF)
}
