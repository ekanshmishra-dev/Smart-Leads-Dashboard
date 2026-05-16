import { Request, Response } from 'express';
import Lead from '../models/Lead';
import asyncHandler from '../utils/asyncHandler';
import { AuthRequest } from '../middleware/authMiddleware';

// @desc    Get all leads with filtering, search, and pagination
// @route   GET /api/leads
// @access  Private
export const getLeads = asyncHandler(async (req: AuthRequest, res: Response) => {
  const pageSize = Number(req.query.pageSize) || 10;
  const page = Number(req.query.pageNumber) || 1;

  const keyword = req.query.keyword
    ? {
        $or: [
          { name: { $regex: String(req.query.keyword), $options: 'i' } },
          { email: { $regex: String(req.query.keyword), $options: 'i' } },
        ],
      }
    : {};

  const status = req.query.status ? { status: String(req.query.status) as any } : {};
  const source = req.query.source ? { source: String(req.query.source) as any } : {};

  const count = await Lead.countDocuments({ ...keyword, ...status, ...source });
  const leads = await Lead.find({ ...keyword, ...status, ...source })
    .limit(pageSize)
    .skip(pageSize * (page - 1))
    .sort(req.query.sort === 'oldest' ? { createdAt: 1 } : { createdAt: -1 });

  res.json({ leads, page, pages: Math.ceil(count / pageSize), total: count });
});

// @desc    Get single lead
// @route   GET /api/leads/:id
// @access  Private
export const getLeadById = asyncHandler(async (req: Request, res: Response) => {
  const lead = await Lead.findById(req.params.id);

  if (lead) {
    res.json(lead);
  } else {
    res.status(404);
    throw new Error('Lead not found');
  }
});

// @desc    Create a lead
// @route   POST /api/leads
// @access  Private
export const createLead = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { name, email, status, source, phone, notes } = req.body;

  const lead = new Lead({
    name,
    email,
    status,
    source,
    phone,
    notes,
    createdBy: req.user._id,
  });

  const createdLead = await lead.save();
  res.status(201).json(createdLead);
});

// @desc    Update a lead
// @route   PUT /api/leads/:id
// @access  Private
export const updateLead = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, status, source, phone, notes } = req.body;

  const lead = await Lead.findById(req.params.id);

  if (lead) {
    lead.name = name || lead.name;
    lead.email = email || lead.email;
    lead.status = status || lead.status;
    lead.source = source || lead.source;
    lead.phone = phone || lead.phone;
    lead.notes = notes || lead.notes;

    const updatedLead = await lead.save();
    res.json(updatedLead);
  } else {
    res.status(404);
    throw new Error('Lead not found');
  }
});

// @desc    Delete a lead
// @route   DELETE /api/leads/:id
// @access  Private/Admin
export const deleteLead = asyncHandler(async (req: Request, res: Response) => {
  const lead = await Lead.findById(req.params.id);

  if (lead) {
    await lead.deleteOne();
    res.json({ message: 'Lead removed' });
  } else {
    res.status(404);
    throw new Error('Lead not found');
  }
});

// @desc    Get leads stats for dashboard
// @route   GET /api/leads/stats
// @access  Private
export const getLeadStats = asyncHandler(async (req: Request, res: Response) => {
  const totalLeads = await Lead.countDocuments();
  const qualifiedLeads = await Lead.countDocuments({ status: 'Qualified' });
  const lostLeads = await Lead.countDocuments({ status: 'Lost' });
  
  const sourceStats = await Lead.aggregate([
    { $group: { _id: '$source', count: { $sum: 1 } } }
  ]);

  const recentLeads = await Lead.find().sort({ createdAt: -1 }).limit(5);

  res.json({
    totalLeads,
    qualifiedLeads,
    lostLeads,
    sourceStats,
    recentLeads
  });
});
