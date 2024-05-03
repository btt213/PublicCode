import copy
import #Custom Package
import time
import torch
import torch.nn as nn
from torch.optim import Adam
class PPO:
    #Set up NN actor and critic base
    def __init__(self, policy_class,args=None, **hyperparameters):
        self.BatchSetData = []
        self._init_hyperparameters(hyperparameters)
        self.obs_dim = args.networkInput
        self.act_dim = args.networkOutput
        self.eprew = []
        torch.autograd.set_detect_anomaly(True)
        self.actor = policy_class(args)                                                   # ALG STEP 1
        self.critic = policy_class(args)
        self.actor_optim = Adam(self.actor.parameters(),amsgrad=True,lr=hyperparameters['lr'])
        self.critic_optim = Adam(self.critic.parameters(),amsgrad=True,lr=hyperparameters['lr'])
        self.cov_var = torch.full(size=(self.act_dim,), fill_value=0.5)
        self.cov_mat = torch.diag(self.cov_var)
        self.logger = {
            'delta_t': time.time_ns(),
            't_so_far': 0,          # timesteps so far
            'i_so_far': 0,          # iterations so far
            'batch_lens': [],       # episodic lengths in batch
            'batch_rews': [],       # episodic returns in batch
            'actor_losses': [],     # losses of actor network in current iteration
        }
    def evalueateAndUpdateNN(self, packedData=None):
        #Update Neural Network for mass results. packedData is a stack of
        # multiple results compiled from distributed computing server

        piecewiseEval = True
        #Unpack packedData
        actor = packedData[0]
        critic= packedData[1]
        batch_obs= packedData[2]
        batch_acts= packedData[3]
        batch_log_probs= packedData[4]
        log_probs= packedData[5]
        batch_lens= packedData[6]
        batch_rews= packedData[7]

        #Iterate Through data
        x4 = len(batch_obs)
        for x1 in range(x4):
            print('Updated NN: ' + str(x1) + ' of ' + str(x4))
            V, _ = self.evaluate(batch_obs[x1], batch_acts[x1])
            A_k = log_probs[x1] - V.detach()
            A_k = (A_k - A_k.mean()) / (A_k.std() + 1e-10)
            for _ in range(self.n_updates_per_iteration):
                V, curr_log_probs = self.evaluate(batch_obs[x1], batch_acts[x1])
                ratios = torch.exp(curr_log_probs - batch_log_probs[x1])
                surr1 = ratios * A_k
                surr2 = torch.clamp(ratios, 1 - self.clip, 1 + self.clip) * A_k
                actor_loss = (-torch.min(surr1, surr2)).mean()
                critic_loss = nn.MSELoss()(V, log_probs[x1])
                self.actor_optim.zero_grad()
                torch.set_grad_enabled(True)
                actor_loss.requires_grad = True
                actor_loss.backward(retain_graph=True)
                self.actor_optim.step()
                self.critic_optim.zero_grad()
                critic_loss.backward()
                self.critic_optim.step()
                self.logger['actor_losses'].append(actor_loss.detach())
            self._log_summary()
            #Custom Modification of NN
            self.actor = ##CustomPackage.CustomFunction(copy.deepcopy(self.actor))
            self.critic = ##CustomPackage.CustomFunction(copy.deepcopy(self.critic))

        #Save NN
        torch.save(self.actor.state_dict(), './' + actor + '.pth')
        torch.save(self.critic.state_dict(), './' + critic + '.pth')
        #Print when sucessfully saves
        print('Done with ' + str(actor))