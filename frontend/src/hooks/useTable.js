import { useState, useMemo } from 'react';

export default function useTable(data, defaultLimit = 10, defaultSort = { key: null, direction: 'asc' }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [limit, setLimit] = useState(defaultLimit);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState(defaultSort);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const processedData = useMemo(() => {
    // 1. Filter
    const searchValues = (obj, term) => {
      if (obj === null || obj === undefined) return false;
      if (typeof obj !== 'object') {
        return String(obj).toLowerCase().includes(term);
      }
      return Object.values(obj).some(val => searchValues(val, term));
    };

    let filtered = data.filter(item => {
      if (!searchTerm) return true;
      return searchValues(item, searchTerm.toLowerCase());
    });

    // 2. Sort
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        let valA = a[sortConfig.key];
        let valB = b[sortConfig.key];
        
        // Handle nested fields like mobil.no_polisi or pelanggan.nama_pelanggan if needed by adding custom switch here
        // But for generic keys:
        if (typeof valA === 'string') valA = valA.toLowerCase();
        if (typeof valB === 'string') valB = valB.toLowerCase();

        if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
        if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [data, searchTerm, sortConfig]);

  const totalPages = Math.ceil(processedData.length / limit) || 1;
  const paginatedData = processedData.slice((currentPage - 1) * limit, currentPage * limit);

  return {
    searchTerm, setSearchTerm,
    limit, setLimit,
    currentPage, setCurrentPage,
    sortConfig, setSortConfig, handleSort,
    processedData, paginatedData, totalPages
  };
}
