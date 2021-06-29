// TODO: This should handle filtering, sorting, paging, etc
export const getChronicles = ({ chronicleGateway  })=>()=>chronicleGateway.list()
;
